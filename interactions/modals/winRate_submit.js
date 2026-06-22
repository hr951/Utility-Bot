const { fields_embed } = require("../../utils/embeds");
const { toHalfWidth } = require("../../utils/toHalfWidth");

module.exports = {
    async execute(interaction) {
        let winRate = interaction.fields.getTextInputValue("winRate");
        let loses = interaction.fields.getTextInputValue("loses");
        let wins = interaction.fields.getTextInputValue("wins");

        winRate = Number(toHalfWidth(winRate));
        loses = Number(toHalfWidth(loses));
        wins = Number(toHalfWidth(wins));

        if (typeof winRate !== "number" || typeof loses !== "number" || typeof wins !== "number" || typeof wins === "undefined" || !winRate) {
            await interaction.reply({
                content: "半角数字で入力してください。"
            });
            return;
        }

        const winRateBy100 = winRate * 100;

        const fields = [
            { name: "目標の勝率", value: `${winRate.toFixed(2)} %` },
            { name: "必要な勝利数", value: `${((winRateBy100 * loses) / (10000 - winRateBy100)).toFixed(0)} 勝` },
            { name: "残り勝利数", value: `${wins ? ((winRateBy100 * loses) / (10000 - winRateBy100)).toFixed(0) - wins + " 勝" : "入力なし"}` },
            { name: "現在の勝利数", value: `${wins ? wins + " 勝" : "入力なし"}` },
            { name: "現在の敗北数", value: `${loses} 敗` },
            { name: "現在の勝率", value: `${wins ? ((wins / (wins + loses)) * 100).toFixed(2) + " %" : "入力なし"}` },
        ];

        const embed = fields_embed("勝率計算", "目標の勝率から必要な勝利数を計算しました！", fields);
        await interaction.reply({
            embeds: [embed]
        });
    }
};