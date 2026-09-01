const { AttachmentBuilder } = require('discord.js');
const { createCanvas, registerFont, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { unixToUTC } = require('../unix2utc');

registerFont(path.join(__dirname, '..', '..', 'fonts/Mojangles.ttf'), { family: 'PixelFont' });

const levels = path.join(__dirname, '..', '..', 'data', 'prestige', 'level.json');
const levels_json = JSON.parse(fs.readFileSync(levels, 'utf8'));
const colors = path.join(__dirname, '..', '..', 'data', 'prestige', 'colors.json');
const colors_json = JSON.parse(fs.readFileSync(colors, 'utf8'));

function PrestigeXp(json, rank) {
    const booster = rank === "ULTIMATE" ? 1.75 : rank === "PLUS" ? 1.5 : 1;
    const xp_rate = [
        { "kill": 3 },
        { "assist": 1 },
        { "flag_capture": 50 },
        { "flag_return": 15 },
        { "win": 100 },
        { "draw": 50 }
    ];
    const victories = json.victories || 0;
    const kills = json.kills || 0;
    const killAssists = json.assists || 0;
    const flagCaptures = json.flags_captured || 0;
    const flagReturns = json.flags_returned || 0;

    const xp = (victories * xp_rate[4].win) +
        (kills * xp_rate[0].kill) +
        (killAssists * xp_rate[1].assist) +
        (flagCaptures * xp_rate[2].flag_capture) +
        (flagReturns * xp_rate[3].flag_return);

    return Math.floor(xp * booster);
};

function PrestigeLevel(xp) {
    const XP_PER_PRESTIGE = levels_json["100"];

    const prestige = Math.floor(xp / XP_PER_PRESTIGE);
    let remainingXp = xp % XP_PER_PRESTIGE;
    let level = 1;

    for (let lv = 2; lv <= 100; lv++) {
        if (remainingXp >= levels_json[lv]) {
            level = lv;
        } else {
            break;
        }
    }

    return {
        totalXp: xp,
        prestige: prestige,
        level: level,
        remainingXp: remainingXp - levels_json[level]
    };
};

async function prestigeBridge(name) {
    const res = await axios.get(`https://api.playhive.com/v0/game/all/bridge/${name}`);
    const user_res = await axios.get(`https://api.playhive.com/v0/game/all/main/${name}`);
    const username = user_res.data.main.username_cc || name;
    const rank = user_res.data.main.rank;

    const wins = (res.data.victories || 0).toLocaleString();
    const losses = (res.data.played - res.data.victories || 0).toLocaleString();
    const gamesPlayed = (res.data.played || 0).toLocaleString();
    const winRate = `${((res.data.victories || 0) / (res.data.played || 1) * 100).toFixed(2)}%`;
    const kills = (res.data.kills || 0).toLocaleString();
    const deaths = (res.data.deaths || 0).toLocaleString();
    const kdr = ((res.data.kills || 0) / (res.data.deaths || 1)).toFixed(2);
    const assists = (res.data.assists || 0).toLocaleString();
    const flagsCaptured = (res.data.flags_captured || 0).toLocaleString();
    const flagsReturned = (res.data.flags_returned || 0).toLocaleString();
    const firstPlayed = unixToUTC(res.data.first_played || 0);
    let prestige = 0;
    if (PrestigeLevel(PrestigeXp(res.data, rank)).prestige > 0) {
        prestige = PrestigeLevel(PrestigeXp(res.data, rank)).prestige;
    }

    const actualWidth = 1614;
    const actualHeight = 1130;
    const designWidth = 800;
    const designHeight = 600;
    const canvas = createCanvas(actualWidth, actualHeight);
    const ctx = canvas.getContext('2d');

    const scaleX = actualWidth / designWidth;
    const scaleY = actualHeight / designHeight;
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

    function drawRoundedRect(ctx, x, y, w, h, r, fillColor, strokeColor, shadowColor = null, shadowBlur = 0) {
        ctx.save();
        if (shadowColor && shadowBlur > 0) {
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
        }
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();

        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }

        ctx.shadowBlur = 0;

        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawGlowText(ctx, text, x, y, fontSize, fontColor, glowColor = null, align = 'center', fontStyle = 'bold') {
        ctx.save();
        ctx.font = `${fontStyle} ${fontSize}px "PixelFont"`;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';

        if (glowColor) {
            ctx.fillStyle = glowColor;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = fontSize * 0.35;
            ctx.fillText(text, x, y);
            ctx.shadowBlur = 0;
        }

        ctx.fillStyle = fontColor;
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    function drawText(ctx, text, x, y, fontSize, fontColor, align = 'center', fontStyle = 'bold') {
        ctx.save();
        ctx.font = `${fontStyle} ${fontSize}px "PixelFont"`;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = fontColor;
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    function drawGlowPartText(ctx, parts, x, y, fontSize, prestige, fontStyle = 'bold') {
        ctx.font = `${fontStyle} ${fontSize}px "PixelFont"`;
        ctx.textBaseline = 'middle';

        let totalWidth = 0;
        parts.forEach(part => {
            part.width = ctx.measureText(part.text).width;
            totalWidth += part.width;
        });

        let currentX = x - (totalWidth / 2);

        parts.forEach(part => {
            if (!part.data) {
                ctx.fillStyle = part.color;
                ctx.textAlign = 'left';
                ctx.fillText(part.text, currentX, y);
            } else {
                if (prestige > 0) {
                    ctx.drawImage(part.data, currentX, y - 15, 33, 30);
                }
            }

            currentX += part.width;
        });
    }

    ctx.fillStyle = '#02050f';
    ctx.fillRect(0, 0, designWidth, designHeight);

    const bgMain = ctx.createLinearGradient(0, 0, designWidth, designHeight);
    bgMain.addColorStop(0, '#051028');
    bgMain.addColorStop(0.25, '#02060f');
    bgMain.addColorStop(1, '#02040c');
    ctx.fillStyle = bgMain;
    ctx.fillRect(0, 0, designWidth, designHeight);

    const halo1 = ctx.createRadialGradient(600, 110, 0, 600, 110, 260);
    halo1.addColorStop(0, 'rgba(255, 105, 180, 0.18)');
    halo1.addColorStop(0.35, 'rgba(255, 105, 180, 0.06)');
    halo1.addColorStop(1, 'rgba(255, 105, 180, 0)');
    ctx.fillStyle = halo1;
    ctx.fillRect(0, 0, designWidth, designHeight);

    const halo2 = ctx.createRadialGradient(120, 240, 0, 120, 240, 240);
    halo2.addColorStop(0, 'rgba(90, 255, 180, 0.14)');
    halo2.addColorStop(0.35, 'rgba(90, 255, 180, 0.04)');
    halo2.addColorStop(1, 'rgba(90, 255, 180, 0)');
    ctx.fillStyle = halo2;
    ctx.fillRect(0, 0, designWidth, designHeight);

    const halo3 = ctx.createRadialGradient(440, 80, 0, 440, 80, 200);
    halo3.addColorStop(0, 'rgba(170, 110, 255, 0.16)');
    halo3.addColorStop(1, 'rgba(170, 110, 255, 0)');
    ctx.fillStyle = halo3;
    ctx.fillRect(0, 0, designWidth, designHeight);

    ctx.save();

    const headerY = 30;
    drawRoundedRect(ctx, 20, headerY, 764, 66, 18, 'rgba(9, 18, 30, 0.88)', 'rgba(88, 210, 255, 0.16)');

    drawGlowText(ctx, 'Overall', 96, 62, 30, '#79f6ff', '#57e3ff');

    drawGlowText(ctx, 'Capture', 300, 62, 35, '#ff5b7f', '#ff5b7f');
    drawGlowText(ctx, 'The', 410, 62, 35, '#ffdb66', '#ffdb66');
    drawGlowText(ctx, 'Flag Statistics', 580, 62, 35, '#7dffd1', '#7dffd1');

    // Player info line
    drawRoundedRect(ctx, 20, 110, 764, 50, 18, 'rgba(9, 18, 30, 0.88)', 'rgba(88, 210, 255, 0.16)');

    let field = [];
    let img;
    let prestigeNumber = "";

    if (prestige === 0) {
        img = "";
        prestigeNumber = "";
    } else if (prestige < 6) {
        img = await loadImage(path.join(__dirname, '..', '..', 'images', 'prestige', `prestige${prestige}.png`));
        prestigeNumber = "    ";
    } else {
        img = "";
        prestigeNumber = `${prestige.toString()} `;
    }

    if (rank === "ULTIMATE") {
        field = [
            { data: img, text: prestigeNumber, color: "#e91e63" },
            { text: `Level ${PrestigeLevel(PrestigeXp(res.data, rank)).level} `, color: `${colors_json[PrestigeLevel(PrestigeXp(res.data, rank)).level]}`, glowColor: `${colors_json[PrestigeLevel(PrestigeXp(res.data, rank)).level]}` },
            { text: username, color: '#d460ff', glowColor: '#d460ff' },
            { text: ' [', color: '#555555', glowColor: '#555555' },
            { text: 'U', color: '#d460ff', glowColor: '#d460ff' },
            { text: ']', color: '#555555', glowColor: '#555555' },
            //{ text: ' [#120]', color: '#ff5555', glowColor: '#ff5555' }
        ];
    } else if (rank === "PLUS") {
        field = [
            { data: img, text: prestigeNumber, color: "#e91e63" },
            { text: `Level ${PrestigeLevel(PrestigeXp(res.data, rank)).level} `, color: `${colors_json[PrestigeLevel(PrestigeXp(res.data, rank)).level]}`, glowColor: `${colors_json[PrestigeLevel(PrestigeXp(res.data, rank)).level]}` },
            { text: username, color: '#55ff55', glowColor: '#55ff55' },
            { text: ' [', color: '#555555', glowColor: '#555555' },
            { text: '+', color: '#55ff55', glowColor: '#55ff55' },
            { text: ']', color: '#555555', glowColor: '#555555' },
            //{ text: ' [#120]', color: '#ff5555', glowColor: '#ff5555' }
        ];
    } else {
        field = [
            { data: img, text: prestigeNumber, color: "#e91e63" },
            { text: `Level ${PrestigeLevel(PrestigeXp(res.data, rank)).level} `, color: `${colors_json[PrestigeLevel(PrestigeXp(res.data, rank)).level]}`, glowColor: `${colors_json[PrestigeLevel(PrestigeXp(res.data, rank)).level]}` },
            { text: username, color: '#aaaaaa', glowColor: '#aaaaaa' },
            //{ text: ' [#120]', color: '#ff5555', glowColor: '#ff5555' }
        ];
    }

    drawGlowPartText(ctx, field, 400, 135, 25, prestige);

    const stats = [
        { label: 'Wins', value: wins, color: '#00aa00', x: 20, y: 171, w: 180, h: 72 },
        { label: 'Losses', value: losses, color: '#ff5555', x: 214, y: 171, w: 180, h: 72 },
        { label: 'Win Rate', value: winRate, color: '#ffff55', x: 409, y: 171, w: 180, h: 72 },
        { label: 'Games Played', value: gamesPlayed, color: '#5555ff', x: 604, y: 171, w: 180, h: 72 },
        { label: 'Kills', value: kills, color: '#00aa00', x: 20, y: 254, w: 180, h: 72 },
        { label: 'Deaths', value: deaths, color: '#ff5555', x: 214, y: 254, w: 180, h: 72 },
        { label: 'KDR', value: kdr, color: '#72e500', x: 409, y: 254, w: 180, h: 72 },
        { label: 'Assists', value: assists, color: '#ffb347', x: 604, y: 254, w: 180, h: 72 },
    ];

    stats.forEach(s => {
        drawRoundedRect(ctx, s.x, s.y, s.w, s.h, 16, 'rgba(7, 16, 28, 0.82)', 'rgba(96, 215, 255, 0.10)');
        const panelGradient = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.h);
        panelGradient.addColorStop(0, 'rgba(255,255,255,0.06)');
        panelGradient.addColorStop(0.15, 'rgba(255,255,255,0.01)');
        panelGradient.addColorStop(1, 'rgba(255,255,255,0)');
        drawRoundedRect(ctx, s.x, s.y, s.w, s.h, 16, panelGradient, null);
        drawText(ctx, s.label, s.x + s.w / 2, s.y + 20, 25, s.color);
        drawText(ctx, s.value, s.x + s.w / 2, s.y + 48, 30, s.color);
    });

    // Flags section
    drawRoundedRect(ctx, 20, 337, 374, 72, 16, 'rgba(7, 16, 28, 0.84)', 'rgba(96, 215, 255, 0.10)');
    const flag1Grad = ctx.createLinearGradient(20, 335, 20, 407);
    flag1Grad.addColorStop(0, 'rgba(255,255,255,0.04)');
    flag1Grad.addColorStop(1, 'rgba(255,255,255,0)');
    drawRoundedRect(ctx, 20, 335, 374, 72, 16, flag1Grad, null);
    drawText(ctx, 'Flags Captured', 207, 355, 25, '#4169e1');
    drawText(ctx, flagsCaptured, 207, 383, 30, '#4169e1');

    drawRoundedRect(ctx, 409, 337, 374, 72, 16, 'rgba(7, 16, 28, 0.84)', 'rgba(96, 215, 255, 0.10)');
    const flag2Grad = ctx.createLinearGradient(410, 335, 410, 407);
    flag2Grad.addColorStop(0, 'rgba(255,255,255,0.04)');
    flag2Grad.addColorStop(1, 'rgba(255,255,255,0)');
    drawRoundedRect(ctx, 410, 335, 374, 72, 16, flag2Grad, null);
    drawText(ctx, 'Flags Returned', 597, 355, 25, '#00bfff');
    drawText(ctx, flagsReturned, 597, 383, 30, '#00bfff');

    // First played bar
    drawRoundedRect(ctx, 20, 420, 764, 44, 14, 'rgba(4, 14, 24, 0.96)', 'rgba(94, 190, 255, 0.20)');
    const playedGrad = ctx.createLinearGradient(20, 420, 20, 464);
    playedGrad.addColorStop(0, 'rgba(255,255,255,0.06)');
    playedGrad.addColorStop(1, 'rgba(255,255,255,0)');
    drawRoundedRect(ctx, 20, 420, 764, 44, 14, playedGrad, null);

    drawGlowPartText(ctx, [
        { text: 'First Played: ', color: '#01bdda' },
        { text: firstPlayed.date, color: '#55ffff' },
        { text: ' at ', color: '#01bdda' },
        { text: firstPlayed.time, color: '#55ffff' }
    ], 400, 440, 20);

    // Progress section
    drawRoundedRect(ctx, 20, 475, 764, 95, 16, 'rgba(7, 16, 28, 0.94)', 'rgba(110, 225, 255, 0.10)');
    const progressGrad = ctx.createLinearGradient(20, 475, 20, 570);
    progressGrad.addColorStop(0, 'rgba(255,255,255,0.06)');
    progressGrad.addColorStop(1, 'rgba(255,255,255,0)');
    drawRoundedRect(ctx, 20, 475, 764, 95, 16, progressGrad, null);
    drawText(ctx, 'Level Progress', 400, 490, 22, '#66cc99');
    drawGlowPartText(ctx, [
        { text: PrestigeLevel(PrestigeXp(res.data, rank)).remainingXp.toLocaleString(), color: '#55ff55' },
        { text: ' / ', color: '#ffffff' },
        { text: (levels_json[`${PrestigeLevel(PrestigeXp(res.data, rank)).level + 1}`] - levels_json[`${PrestigeLevel(PrestigeXp(res.data, rank)).level}`]).toLocaleString(), color: '#ff5555' }
    ], 400, 515, 25);

    const blockCount = Math.floor(PrestigeLevel(PrestigeXp(res.data, rank)).remainingXp / (levels_json[`${PrestigeLevel(PrestigeXp(res.data, rank)).level + 1}`] - levels_json[`${PrestigeLevel(PrestigeXp(res.data, rank)).level}`]) * 10);
    const blockMax = 10;
    const blockWidth = 18;
    const blockHeight = 18;
    const blockGap = 6;
    const totalWidth = blockMax * blockWidth + (blockMax - 1) * blockGap;
    const blockStartX = 400 - totalWidth / 2;
    const blockY = 540;



    for (let i = 0; i < blockMax; i++) {
        if (i < blockCount) {
            drawRoundedRect(ctx, blockStartX + i * (blockWidth + blockGap), blockY, blockWidth, blockHeight, 0, 'rgba(132, 255, 57, 0.95)');
        } else {
            drawRoundedRect(ctx, blockStartX + i * (blockWidth + blockGap), blockY, blockWidth, blockHeight, 0, 'rgba(255, 0, 8, 0.95)');
        }
    }

    drawGlowPartText(ctx, [
        { text: `Level ${PrestigeLevel(PrestigeXp(res.data, rank)).level}`, color: `${colors_json[PrestigeLevel(PrestigeXp(res.data, rank)).level]}`, glowColor: `${colors_json[PrestigeLevel(PrestigeXp(res.data, rank)).level]}` },
        { text: ' [', color: '#474747' }
    ], blockStartX - (ctx.measureText(`Level ${PrestigeLevel(PrestigeXp(res.data, rank)).level}`).width) / 2 - 16, blockY + blockHeight / 2, 25);

    drawGlowPartText(ctx, [
        { text: '] ', color: '#474747' },
        { text: `Level ${PrestigeLevel(PrestigeXp(res.data, rank)).level + 1}`, color: `${colors_json[PrestigeLevel(PrestigeXp(res.data, rank)).level + 1]}`, glowColor: `${colors_json[PrestigeLevel(PrestigeXp(res.data, rank)).level + 1]}` }
    ], blockStartX + totalWidth + (ctx.measureText(`Level ${PrestigeLevel(PrestigeXp(res.data, rank)).level + 1}`).width) / 2 + 16, blockY + blockHeight / 2, 25);

    const attachment = new AttachmentBuilder(canvas.createPNGStream(), { name: username + "_prestigeCTF.png" });

    return attachment;
}

module.exports = {
    prestigeBridge
};