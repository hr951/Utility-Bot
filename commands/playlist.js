const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require("discord.js");
const { model } = require('../db/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("ユーザープレイリストを編集・設定します"),

    async execute(interaction) {
        let userPlayList = {};

        try {
            const msgPoint = await model.findOne({ _id: interaction.user.id });
            userPlayList = JSON.parse(msgPoint.playlist);
            if (!userPlayList) {
                userPlayList = null;
            }
        } catch (error) {
            console.error(error);
        }

        const modal = new ModalBuilder()
            .setTitle("ユーザープレイリストの編集")
            .setCustomId("playlist_submit");
        const TextInput_1 = new TextInputBuilder()
            .setLabel("プレイリストの題名")
            .setCustomId("name")
            .setStyle("Short")
            .setValue(Object.values(userPlayList["PlayList" + interaction.user.id]?.name || {}).join("") || " ")
            .setMaxLength(10)
            .setRequired(true);
        const TextInput_2 = new TextInputBuilder()
            .setLabel("プレイリストの説明")
            .setCustomId("description")
            .setStyle("Short")
            .setValue(Object.values(userPlayList["PlayList" + interaction.user.id]?.description || {}).join("") || " ")
            .setMaxLength(50)
            .setRequired(true);
        const TextInput_3 = new TextInputBuilder()
            .setLabel("曲名かYouTubeのURL")
            .setCustomId("list")
            .setStyle("Paragraph")
            .setValue(Object.values(userPlayList["PlayList" + interaction.user.id]?.list || {}).join('\n') || " ")
            .setPlaceholder("例)\nhttps://www.youtube.com/watch?v=~~~~~\nhttps://www.youtube.com/watch?v=~~~~~\n曲名1\n曲名2")
            .setMaxLength(4000)
            .setRequired(true);
        const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
        const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
        const ActionRow_3 = new ActionRowBuilder().setComponents(TextInput_3);
        modal.setComponents(ActionRow, ActionRow_2, ActionRow_3);
        return interaction.showModal(modal);
    },
}