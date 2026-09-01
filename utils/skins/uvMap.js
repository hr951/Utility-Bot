/**
 * Minecraft(Java版/統合版とも共通)標準スキンの 64x64 テクスチャレイアウトの
 * UV座標マップ。Mojangが1.8で策定した形式で、2014年以降ずっと変わっていない。
 *
 * このレンダラーは「正面やや右・やや上」から見た固定アングルのアイソメトリック
 * 投影しか行わないため、各パーツにつき top(上面) / front(前面) / right(右側面)
 * の3面分のUV座標だけを保持している(back/left/bottomは常に隠れるため不要)。
 */

// classic(通常腕/Steve型)は腕の幅4px、slim(細腕/Alex型)は3px
// classic(通常腕/Steve型)は腕の幅4px、slim(細腕/Alex型)は3px
function getParts(model = "classic") {
    const armW = model === "slim" ? 3 : 4;

    // ヘルパー関数: boxを全方向にexpand分拡張する (オーバーレイ用: expand=0.5で幅・高さ・奥行きが+1px)
    const expandBox = (box, expand = 0.5) => ({
        x: [box.x[0] - expand, box.x[1] + expand],
        y: [box.y[0] - expand, box.y[1] + expand],
        z: [box.z[0] - expand, box.z[1] + expand],
    });

    // ベース(1層目)の基本形状データ
    const baseParts = [
        {
            name: "leftLeg",
            box: { x: [4, 8], y: [0, 12], z: [0, 4] },
            uvBase: { top: [20, 48, 4, 4], front: [20, 52, 4, 12], right: [16, 52, 4, 12] },
            uvOverlay: { top: [4, 48, 4, 4], front: [4, 52, 4, 12], right: [0, 52, 4, 12] },
        },
        {
            name: "rightLeg",
            box: { x: [8, 12], y: [0, 12], z: [0, 4] },
            uvBase: { top: [4, 16, 4, 4], front: [4, 20, 4, 12], right: [0, 20, 4, 12] },
            uvOverlay: { top: [4, 32, 4, 4], front: [4, 36, 4, 12], right: [0, 36, 4, 12] },
        },
        {
            name: "torso",
            box: { x: [4, 12], y: [12, 24], z: [0, 4] },
            uvBase: { top: [20, 16, 8, 4], front: [20, 20, 8, 12], right: [16, 20, 4, 12] },
            uvOverlay: { top: [20, 32, 8, 4], front: [20, 36, 8, 12], right: [16, 36, 4, 12] },
        },
        {
            name: "leftArm",
            // slimの時は x:[1, 4] にすることで胴体(x=4)に接着させる
            box: { x: [4 - armW, 4], y: [12, 24], z: [0, 4] },
            uvBase: { top: [36, 48, armW, 4], front: [36, 52, armW, 12], right: [32, 52, 4, 12] },
            uvOverlay: { top: [52, 48, armW, 4], front: [52, 52, armW, 12], right: [48, 52, 4, 12] },
        },
        {
            name: "rightArm",
            box: { x: [12, 12 + armW], y: [12, 24], z: [0, 4] },
            uvBase: { top: [44, 16, armW, 4], front: [44, 20, armW, 12], right: [40, 20, 4, 12] },
            uvOverlay: { top: [44, 32, armW, 4], front: [44, 36, armW, 12], right: [40, 36, 4, 12] },
        },
        {
            name: "head",
            box: { x: [4, 12], y: [24, 32], z: [-2, 6] },
            uvBase: { top: [8, 0, 8, 8], front: [8, 8, 8, 8], right: [0, 8, 8, 8] },
            uvOverlay: { top: [40, 0, 8, 8], front: [40, 8, 8, 8], right: [32, 8, 8, 8] },
        },
    ];

    // ベース層とオーバーレイ層でそれぞれboxを持つ独立した要素に分割
    const parts = [];
    for (const part of baseParts) {
        // ベース（1層目）
        parts.push({
            name: part.name,
            box: part.box,
            layers: [part.uvBase],
        });
        // オーバーレイ（2層目: 帽子・スリーブ・ジャケット等。+0.5pxずつ膨張させる）
        parts.push({
            name: `${part.name}_overlay`,
            box: expandBox(part.box, 0.5),
            layers: [part.uvOverlay],
        });
    }

    return parts;
}

/**
 * classic(通常)/slim(細腕)を自動判定する。
 * Mojangの慣習で、64x64スキンの座標(54,20)のアルファが0(透明)ならslim。
 */
function detectModel(imageData, width) {
    const x = 54;
    const y = 20;
    const idx = (y * width + x) * 4;
    const alpha = imageData[idx + 3];
    return alpha === 0 ? "slim" : "classic";
}

module.exports = {
    getParts,
    detectModel
}