const { ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const { basic_embed, image_embed } = require("../../utils/embeds");
const path = require('path');
const fs = require("fs");

const nte_modules = [
    "fonsPerWeek",
    "dailyBagel"
];

const nte_fons_names = {
    "1week": "更新周期: **１週間**",
    "2week": "更新周期: **２週間**",
    daily: "デイリー",
    stamina: "シティスタミナ",
    coffee: "零のコーヒー",
    send: "無料配達",
    mamon: "マモン",
    steal: "大強盗",
};

module.exports = {
    async execute(interaction) {
        const value = interaction.values[0];

        if (value === nte_modules[0]) {
            const fonsList = path.join(__dirname, '..', '..', 'data', 'fons.json');
            const fonsList_json = JSON.parse(fs.readFileSync(fonsList, 'utf8'));

            const list = [];

            for (const [week, categories] of Object.entries(fonsList_json)) {
                list.push(nte_fons_names[week]);
                for (const [category, detail] of Object.entries(categories)) {
                    list.push(`${nte_fons_names[category]} ` + '**`' + `${(detail.fons * 10000).toLocaleString()}` + '`**' + ` ${detail.complete ? "済" : "**未**"}`);
                }
            }

            const renew = new ButtonBuilder()
                .setCustomId(`fons_renew`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel("更新")
                .setEmoji("🔄");

            await interaction.reply({
                embeds: [basic_embed("獲得可能ファンス/週", list.join("\n"))],
                components: [new ActionRowBuilder().addComponents(renew)]
            });
        } else if (value === nte_modules[1]) {
            const img = new AttachmentBuilder()
                .setName(`bagel.png`)
                .setFile(`./images/bagel.png`);
            return interaction.reply({
                embeds: [image_embed("attachment://bagel.png")],
                files: [img]
            });
        }

    }
};