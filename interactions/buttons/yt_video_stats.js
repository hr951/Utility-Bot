const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setTitle("表示する動画を選択")
            .setCustomId("yt_video_stats_submit");
        const TextInput_1 = new TextInputBuilder()
            .setLabel("表示する動画のID")
            .setCustomId("id")
            .setStyle("Short")
            .setPlaceholder("例) SOB3rMGNDj0")
            .setMaxLength(20)
            .setRequired(true);
        const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
        modal.setComponents(ActionRow);
        return interaction.showModal(modal);

    }
};