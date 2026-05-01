const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setTitle("チケット")
            .setCustomId("report_submit");
        const TextInput_1 = new TextInputBuilder()
            .setLabel("題名を入力してください。")
            .setCustomId("title")
            .setStyle("Short")
            .setPlaceholder(" ")
            .setMaxLength(100)
            .setMinLength(2)
            .setRequired(true);
        const TextInput_2 = new TextInputBuilder()
            .setLabel("内容を入力してください。")
            .setCustomId("content")
            .setStyle("Paragraph")
            .setPlaceholder(" ")
            .setMaxLength(1000)
            .setMinLength(2)
            .setRequired(true);
        const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
        const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
        modal.setComponents(ActionRow, ActionRow_2);
        return interaction.showModal(modal);
    }
};