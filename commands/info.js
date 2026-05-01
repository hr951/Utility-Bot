const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { page1 } = require('../utils/pages.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Mina鯖 Botの情報を表示します"),

    async execute(interaction) {

        const back = new ButtonBuilder()
            .setCustomId(`info_back`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("前へ")
            .setEmoji("⏪");

        const next = new ButtonBuilder()
            .setCustomId(`info_next`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("次へ")
            .setEmoji("⏩");

        await interaction.reply({
            embeds: [page1(interaction)],
            components: [new ActionRowBuilder().addComponents(back, next)],
        });
    },
};