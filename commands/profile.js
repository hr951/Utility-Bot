const { SlashCommandBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas');
registerFont('./font/Nosutaru-dotMPlusH-10-Regular.ttf', { family: 'mojang' });
const { model } = require('../db/db');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('プロフィール画像を作成します')
        .addStringOption(option =>
            option.setName('minecraft-id')
                .setDescription('マイクラのIDを書いてください')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('comment')
                .setDescription('ひとことを書いてください')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("sns1")
                .setDescription("使用しているSNSを選択してください")
                .setRequired(false) //trueで必須、falseで任意
                .addChoices(
                    { name: "Twitter", value: "x" },
                    { name: "Youtube", value: "yt" },
                    { name: "Discord", value: "discord" },
                    { name: "Scratch", value: "sc" },
                    { name: "Instagram", value: "ig" },
                    { name: "TikTok", value: "tt" }
                )
        )
        .addStringOption((option) =>
            option
                .setName("sns2")
                .setDescription("使用しているSNSを選択してください")
                .setRequired(false) //trueで必須、falseで任意
                .addChoices(
                    { name: "Twitter", value: "x" },
                    { name: "Youtube", value: "yt" },
                    { name: "Discord", value: "discord" },
                    { name: "Scratch", value: "sc" },
                    { name: "Instagram", value: "ig" },
                    { name: "TikTok", value: "tt" }
                )
        )
        .addStringOption((option) =>
            option
                .setName("sns3")
                .setDescription("使用しているSNSを選択してください")
                .setRequired(false) //trueで必須、falseで任意
                .addChoices(
                    { name: "Twitter", value: "x" },
                    { name: "Youtube", value: "yt" },
                    { name: "Discord", value: "discord" },
                    { name: "Scratch", value: "sc" },
                    { name: "Instagram", value: "ig" },
                    { name: "TikTok", value: "tt" }
                )
        ),

    async execute(interaction) {

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        let url_bg = "./images/background.png";
        let points = 0;
        let all_points = 0;
        let bg_type = 0;
        let bg_url = "undefined";
        try {
            const msgPoint = await model.findOne({ _id: interaction.user.id });
            points = msgPoint.point;
            all_points = msgPoint.all_point;
            bg_type = msgPoint.bg_type;
            bg_url = msgPoint.bg_url;

            if (isNaN(points)) {
                points = 0;
            }
            if (isNaN(all_points)) {
                all_points = 0;
            }

        } catch (error) {
            console.error(error);
        }

        await interaction.editReply({ content: "画像を生成しています...\nエラーが発生した場合は画像が生成されません。", flags: [MessageFlags.Ephemeral] });
        try {
            const interact = interaction.channel;

            const mcid = interaction.options.getString('minecraft-id');
            const comment = interaction.options.getString('comment');
            const sns1 = interaction.options.getString("sns1");
            const sns2 = interaction.options.getString("sns2");
            const sns3 = interaction.options.getString("sns3");

            const ig = await loadImage('./images/instagram_icon.png');
            const discord = await loadImage('./images/discord_icon.png');
            const tt = await loadImage('./images/tiktok_icon.png');
            const x = await loadImage('./images/twitter_icon.png');
            const yt = await loadImage('./images/youtube_icon.png');
            const sc = await loadImage('./images/scratch_icon.png');

            if (bg_type == 0) {
                url_bg = './images/background.png';
            } else if (bg_type == 1) {
                url_bg = './images/bg-50.png';
            } else if (bg_type == 2) {
                url_bg = bg_url;
            }
            const backgroundImage = await loadImage(url_bg);

            const canvas = createCanvas(1920, 1080);
            const context = canvas.getContext('2d');
            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            const make_img = await interact.send({ content: "画像を生成しています...", flags: [MessageFlags.Ephemeral] });


            if (sns1) {
                if (sns1 === "ig") {
                    context.drawImage(ig, 360, 250, 100, 100);
                } else if (sns1 === "discord") {
                    context.drawImage(discord, 360, 250, 100, 100);
                } else if (sns1 === "tt") {
                    context.drawImage(tt, 360, 250, 100, 100);
                } else if (sns1 === "x") {
                    context.drawImage(x, 360, 250, 100, 100);
                } else if (sns1 === "yt") {
                    context.drawImage(yt, 360, 250, 100, 100);
                } else if (sns1 === "sc") {
                    context.drawImage(sc, 360, 250, 100, 100);
                }
            }

            if (sns2) {
                if (sns2 === "ig") {
                    context.drawImage(ig, 480, 250, 100, 100);
                } else if (sns2 === "discord") {
                    context.drawImage(discord, 480, 250, 100, 100);
                } else if (sns2 === "tt") {
                    context.drawImage(tt, 480, 250, 100, 100);
                } else if (sns2 === "x") {
                    context.drawImage(x, 480, 250, 100, 100);
                } else if (sns2 === "yt") {
                    context.drawImage(yt, 480, 250, 100, 100);
                } else if (sns2 === "sc") {
                    context.drawImage(sc, 480, 250, 100, 100);
                }
            }

            if (sns3) {
                if (sns3 === "ig") {
                    context.drawImage(ig, 600, 250, 100, 100);
                } else if (sns3 === "discord") {
                    context.drawImage(discord, 600, 250, 100, 100);
                } else if (sns3 === "tt") {
                    context.drawImage(tt, 600, 250, 100, 100);
                } else if (sns3 === "x") {
                    context.drawImage(x, 600, 250, 100, 100);
                } else if (sns3 === "yt") {
                    context.drawImage(yt, 600, 250, 100, 100);
                } else if (sns3 === "sc") {
                    context.drawImage(sc, 600, 250, 100, 100);
                }
            }

            try {
                const str = comment;
                const maxLength = 13;
                let newStr = "";

                for (let i = 0; i < str.length; i += maxLength) {
                    newStr += str.substr(i, maxLength) + "\n";
                }

                context.font = '150px "mojang"';
                context.textAlign = 'start'
                context.textBaseline = 'middle'
                context.lineWidth = 15
                context.strokeStyle = '#000000';//色は黒
                context.strokeText(interaction.member.displayName, 360, 180);
                context.fillStyle = '#ffffff';//色は白
                context.fillText(interaction.member.displayName, 360, 180);

                context.font = '112px "mojang"';
                context.strokeStyle = '#000000';//色は黒
                context.strokeText(`Minecraft ID: ${mcid}`, 75, 427.5);
                context.fillStyle = '#ffffff';//色は白
                context.fillText(`Minecraft ID: ${mcid}`, 75, 427.5);
                context.strokeText(`一言`, 75, 570);
                context.fillText(`一言`, 75, 570);

                context.font = '90px "mojang"';
                context.strokeText(`所持ポイント: ${points}`, 1100, 570);
                context.fillText(`所持ポイント: ${points}`, 1100, 570);
                context.strokeText(`総ポイント: ${all_points}`, 1100, 712.5);
                context.fillText(`総ポイント: ${all_points}`, 1100, 712.5);

                context.font = '70px "mojang"';
                context.strokeText(`${newStr}`, 130, 670);
                context.fillText(`${newStr}`, 130, 670);

                context.font = '45px "mojang"';
                context.strokeText(`Copyright © 2024 @hi_ro951`, 1305, 1035);
                context.fillText(`Copyright © 2024 @hi_ro951`, 1305, 1035);

                context.strokeStyle = 'blue';
                context.lineWidth = 5
                // パスの開始
                context.beginPath();
                // 折れ線
                context.moveTo(330, 570);
                context.lineTo(1050, 570);
                context.lineTo(1050, 1050);
                context.lineTo(105, 1050);
                context.lineTo(105, 645);
                // 描画
                context.stroke();

                try {
                    context.beginPath();
                    context.arc(187.5, 187.5, 150, 0, Math.PI * 2, true);
                    context.closePath();
                    context.clip();
                    const url_icon = interaction.user.avatarURL({ extension: 'jpg' }) + "?raw=true";
                    const iconImage = await loadImage(url_icon);
                    context.drawImage(iconImage, 37, 37, 300, 300);
                } catch {
                    try {
                        const icon = await loadImage('./images/err-icon.png')
                        context.drawImage(icon, 30, 30, 200, 200);
                    } catch (error) {
                        console.error(error);
                    }
                }

                const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: mcid + "_stats.png" });

                const Button = new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}`)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("削除する")
                    .setEmoji("🗑️");

                //await interaction.editReply("画像を生成しました！");
                await make_img.edit({ content: "", files: [attachment], components: [new ActionRowBuilder().setComponents(Button)] });

            } catch (error) {
                console.error(error);

                const Button = new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}`)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("削除する");

                //await interaction.editReply("画像の生成に失敗しました。");
                await make_img.edit({ content: "画像の生成に失敗しました。", components: [new ActionRowBuilder().setComponents(Button)] });
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply("カスタム背景を取得できませんでした。")
        }
    },

}
