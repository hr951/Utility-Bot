const { MessageFlags } = require("discord.js");
const { model } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        let points = 0;
        try {
            const msgPoint = await model.findOne({ _id: interaction.user.id });
            points = msgPoint.point;
        } catch (error) {
            console.error(error);
            if (isNaN(points)) {
                points = 0;
            }
        }
        if (points < 0) {
            await interaction.reply({ content: `**${0 - points}**ポイント分不足しています。`, flags: [MessageFlags.Ephemeral] });
            return;
        }
        try {
            await model.findOneAndUpdate(
                { _id: interaction.user.id }, // 条件
                {
                    $set: {
                        name: interaction.user.username,
                        point: points - 0,
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );
            interaction.reply({ content: `Coming Soon!\n更新をお待ちください!`, flags: [MessageFlags.Ephemeral] });
        } catch (error) {
            console.error("Update Error:", error);
        }
    }
};