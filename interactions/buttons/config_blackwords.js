const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require("discord.js");
const { serverModel } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        let blackWords;
        try {
            const server_config = await serverModel.findOne({ _id: "1265637138247057428" });
            blackWords = JSON.parse(server_config.black_words);
            if (!blackWords) {
                blackWords = null;
            }
        } catch (error) {
            console.log(error);
        }

        const modal = new ModalBuilder()
            .setTitle("NGワード 設定更新")
            .setCustomId("blackwords_submit");
        const TextInput_1 = new TextInputBuilder()
            .setLabel("完全一致で禁止するワードを記述してください")
            .setCustomId("exact")
            .setStyle("Paragraph")
            .setValue(blackWords?.ExactMatch?.join("\n") || " ")
            .setMaxLength(4000)
            .setRequired(true);
        const TextInput_2 = new TextInputBuilder()
            .setLabel("部分一致で禁止するワードを記述してください")
            .setCustomId("partial")
            .setStyle("Paragraph")
            .setValue(blackWords?.PartialMatch?.join("\n") || " ")
            .setMaxLength(4000)
            .setRequired(true);
        const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
        const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
        modal.setComponents(ActionRow, ActionRow_2);
        return interaction.showModal(modal);

    }
};