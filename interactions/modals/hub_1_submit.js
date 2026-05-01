const { MessageFlags } = require("discord.js");
const { serverModel } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        const ip_hub_1_je = interaction.fields.getTextInputValue("ip_hub_1_je");
        const port_hub_1_je = interaction.fields.getTextInputValue("port_hub_1_je");
        const ip_hub_1_be = interaction.fields.getTextInputValue("ip_hub_1_be");
        const port_hub_1_be = interaction.fields.getTextInputValue("port_hub_1_be");

        try {
            await serverModel.findOneAndUpdate(
                { _id: "1265637138247057428" }, // 条件
                {
                    $set: {
                        ip_hub_1_je: ip_hub_1_je,
                        port_hub_1_je: parseInt(port_hub_1_je),
                        ip_hub_1_be: ip_hub_1_be,
                        port_hub_1_be: parseInt(port_hub_1_be)
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );
            interaction.reply({ content: `サーバー情報を更新しました\nBotを再起動します...`, flags: [MessageFlags.Ephemeral] });
            setTimeout(() => {
                process.exit(0);
            }, 1000);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: `サーバー情報の更新に失敗しました`, flags: [MessageFlags.Ephemeral] });
        }
    }
};