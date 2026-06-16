const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');
const hive_modules = [
    "winRate"
];

module.exports = {
    async execute(interaction) {
        const value = interaction.values[0];

        if (value === hive_modules[0]) {
            const modal = new ModalBuilder()
                .setTitle("勝率計算")
                .setCustomId("winRate_submit");
            const TextInput_1 = new TextInputBuilder()
                .setLabel("目標の勝率を入力してください (半角数字のみ)")
                .setCustomId("winRate")
                .setStyle("Short")
                .setMaxLength(4000)
                .setRequired(true);
            const TextInput_2 = new TextInputBuilder()
                .setLabel("現在の敗北数を入力してください (半角数字のみ)")
                .setCustomId("loses")
                .setStyle("Short")
                .setMaxLength(4000)
                .setRequired(true);
            const TextInput_3 = new TextInputBuilder()
                .setLabel("現在の勝利数を入力してください (半角数字のみ・任意)")
                .setCustomId("wins")
                .setStyle("Short")
                .setMaxLength(4000)
                .setRequired(false);
            const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
            const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
            const ActionRow_3 = new ActionRowBuilder().setComponents(TextInput_3);
            modal.setComponents(ActionRow, ActionRow_2, ActionRow_3);
            return interaction.showModal(modal);
        }

    }
};