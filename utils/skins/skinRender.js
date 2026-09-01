const { createCanvas, loadImage } = require("canvas");
const fs = require('fs');
const path = require('path');
const { getParts, detectModel } = require("./uvMap.js");

// 「正面やや右・やや上」から見た固定アングルの真アイソメトリック(30度)投影。
// ブラウザもWebGLも使わず、2D canvasの座標変換(setTransform)だけで
// 立方体の3面(上面/前面/右側面)をスキン画像から貼り付けて描画する。
const COS30 = Math.sqrt(3) / 2; // ≒0.866
const SIN30 = 0.5;

// ワールド軸(X=右方向, Y=上方向, Z=前方向)をスクリーンベクトルへ
const E_X = { x: COS30, y: SIN30 }; // 右へ行くほど画面右下へ
const E_Z = { x: -COS30, y: SIN30 }; // 手前へ行くほど画面左下へ
const E_Y = { x: 0, y: -1 }; // 上へ行くほど画面上へ

function project(x, y, z, scale) {
    return {
        x: (x * E_X.x + y * E_Y.x + z * E_Z.x) * scale,
        y: (x * E_X.y + y * E_Y.y + z * E_Z.y) * scale,
    };
}

/**
 * Minecraftスキン(展開図PNG、URLまたはローカルパス)を疑似3D(アイソメトリック)
 * 画像として描画し、PNGとして保存する。Puppeteer/WebGL不使用。
 *
 * @param {string} skinSource  スキン画像のURL、またはローカルファイルパス
 * @param {string} outputPath  保存先パス
 * @param {object} [options]
 * @param {"auto-detect"|"default"|"slim"} [options.model="auto-detect"]
 * @param {number} [options.scale=8]     テクスチャ1pxあたりの出力px数
 * @param {number} [options.padding=16]  余白px
 * @param {string|null} [options.background=null] 背景色。nullで透過PNG
 */
async function renderSkinIsometric(skinSource, outputPath, options = {}) {
    const { model: modelOpt = "auto-detect", scale = 8, padding = 16, background = null } = options;

    const image = await loadImage(await resolveSource(skinSource));

    // モデル(classic/slim)の判定。画像から1pxだけ読み取る小さなcanvasを使う。
    let model = modelOpt;
    if (modelOpt === "auto-detect" || modelOpt === "default") {
        if (modelOpt === "auto-detect") {
            const probe = createCanvas(image.width, image.height);
            const pctx = probe.getContext("2d");
            pctx.drawImage(image, 0, 0);
            const data = pctx.getImageData(0, 0, image.width, image.height).data;
            model = detectModel(data, image.width);
        } else {
            model = "classic";
        }
    }

    const parts = getParts(model === "default" ? "classic" : model);

    // 全パーツの8頂点を投影し、バウンディングボックスからキャンバスサイズを決定
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const part of parts) {
        const [x0, x1] = part.box.x;
        const [y0, y1] = part.box.y;
        const [z0, z1] = part.box.z;
        for (const x of [x0, x1]) {
            for (const y of [y0, y1]) {
                for (const z of [z0, z1]) {
                    const p = project(x, y, z, scale);
                    minX = Math.min(minX, p.x);
                    maxX = Math.max(maxX, p.x);
                    minY = Math.min(minY, p.y);
                    maxY = Math.max(maxY, p.y);
                }
            }
        }
    }

    const width = Math.ceil(maxX - minX) + padding * 2;
    const height = Math.ceil(maxY - minY) + padding * 2;
    const offsetX = padding - minX;
    const offsetY = padding - minY;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false; // ドット絵なのでアンチエイリアスは切る

    if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
    }

    // 奥から手前へ(画家アルゴリズム)。x+zが小さい(=カメラから遠い)パーツから描く。
    const drawOrder = [...parts].sort((a, b) => {
        const da = center(a.box.x) + center(a.box.z);
        const db = center(b.box.x) + center(b.box.z);
        return da - db;
    });

    for (const part of drawOrder) {
        for (const layer of part.layers) {
            drawBox(ctx, image, part.box, layer, scale, offsetX, offsetY);
        }
    }

    const out = fs.createWriteStream(path.join(__dirname, '..', '..', outputPath));
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    return outputPath;
}

function center([a, b]) {
    return (a + b) / 2;
}

function drawBox(ctx, image, box, uv, scale, offsetX, offsetY) {
    const [x0, x1] = box.x;
    const [y0, y1] = box.y;
    const [z0, z1] = box.z;

    // 上面: (x0,y1,z0)を起点に +x方向・+z方向へ
    drawFace(ctx, image, uv.top, project(x0, y1, z0, scale), E_X, E_Z, scale, offsetX, offsetY);

    // 前面(+z面): (x0,y1,z1)を起点に +x方向・下方向へ
    drawFace(ctx, image, uv.front, project(x0, y1, z1, scale), E_X, { x: -E_Y.x, y: -E_Y.y }, scale, offsetX, offsetY);

    // 右側面(+x面): (x1,y1,z0)を起点に +z方向・下方向へ
    drawFace(ctx, image, uv.right, project(x1, y1, z0, scale), E_Z, { x: -E_Y.x, y: -E_Y.y }, scale, offsetX, offsetY);
}

function drawFace(ctx, image, rect, anchorScreen, uAxis, vAxis, scale, offsetX, offsetY) {
    const [sx, sy, sw, sh] = rect;
    ctx.setTransform(
        uAxis.x * scale,
        uAxis.y * scale,
        vAxis.x * scale,
        vAxis.y * scale,
        anchorScreen.x + offsetX,
        anchorScreen.y + offsetY
    );
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

async function resolveSource(skinSource) {
    if (/^https?:\/\//i.test(skinSource)) {
        const res = await fetch(skinSource);
        if (!res.ok) {
            throw new Error(`スキン画像の取得に失敗しました: ${res.status} ${res.statusText}`);
        }
        return Buffer.from(await res.arrayBuffer());
    }
    return skinSource; // ローカルパスはloadImageがそのまま読める
}

module.exports = {
    renderSkinIsometric
};