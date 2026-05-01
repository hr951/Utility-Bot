const { SlashCommandBuilder, MessageFlags, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { model } = require('../db/db');
let playListData = require('../data/playList.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("プレイリストから再生します"),

    async execute(interaction) {
        let userPlayList;

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: "先にボイスチャンネルに入ってください", flags: [MessageFlags.Ephemeral] });
        }

        try {
            const msgPoint = await model.findOne({ _id: interaction.user.id });
            userPlayList = JSON.parse(msgPoint.playlist);
            if (!userPlayList) {
                userPlayList = null;
            }

            const dbDataFormatted = {};
            Object.entries(await userPlayList).forEach(([id, content]) => {
                dbDataFormatted[id] = content;
            });
            playListData = { ...playListData, ...dbDataFormatted };

        } catch (error) {
            console.error(error);
        }

        const options = Object.entries(playListData).map(([id, content]) => {
            return new StringSelectMenuOptionBuilder()
                .setLabel(content.name)
                .setValue(id)
                .setDescription(content.description || "説明なし");
        });

        const menu = new StringSelectMenuBuilder()
            .setCustomId("select_playlist")
            .setPlaceholder("再生するプレイリストを選択してください")
            .addOptions(options.slice(0, 25));

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            components: [row],
            flags: [MessageFlags.Ephemeral]
        });
    },
}