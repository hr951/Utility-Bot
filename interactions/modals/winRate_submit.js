const { fields_embed } = require("../../utils/embeds");

module.exports = {
    async execute(interaction) {
        const winRate = interaction.fields.getTextInputValue("winRate");
        const loses = interaction.fields.getTextInputValue("loses");
        const wins = interaction.fields.getTextInputValue("wins");

        const winRateBy100 = winRate * 100;

        const fields = [
            { name: "目標の勝率", value: `${winRate.toFixed(2)} %` },
            { name: "必要な勝利数", value: `${((winRateBy100 * loses) / (10000 - winRateBy100)).toFixed(0)} 勝` },
            { name: "残り勝利数", value: `${wins ? ((winRateBy100 * loses) / (10000 - winRateBy100)).toFixed(0) - wins : "Undefined"} 勝` },
            { name: "現在の勝利数", value: wins ? wins : "Undefined" },
            { name: "現在の敗北数", value: loses },
            { name: "現在の勝率", value: wins ? ((Number(wins) / (Number(wins) + Number(loses))) * 100).toFixed(2) : "Undefined" },
        ];

        const embed = fields_embed("勝率計算", "目標の勝率から必要な勝利数を計算しました！", fields);
        await interaction.reply({
            embeds: [embed]
        });
    }
};