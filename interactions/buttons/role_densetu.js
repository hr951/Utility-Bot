const { MessageFlags } = require("discord.js");
const { model } = require('../../db/db');

module.exports = {
    async execute(interaction, client) {
        let points = 0;
        let densetu_role = false;
        try {
            const msgPoint = await model.findOne({ _id: interaction.user.id });
            points = msgPoint.point;
            densetu_role = msgPoint.densetu_role;

            if (isNaN(points)) {
                points = 0;
            }
            if (!densetu_role) {
                densetu_role = false;
            }
        } catch (error) {
            console.error(error);
        }
        if (densetu_role) {
            await interaction.reply({ content: `すでに有効化されています。`, flags: [MessageFlags.Ephemeral] });
            return;
        } else if (points < 10000) {
            await interaction.reply({ content: `**${10000 - points}**ポイント分不足しています。`, flags: [MessageFlags.Ephemeral] });
            return;
        }
        try {
            await model.findOneAndUpdate(
                { _id: interaction.user.id }, // 条件
                {
                    $set: {
                        name: interaction.user.username,
                        point: points - 10000,
                        densetu_role: true
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );

            const guild = await client.guilds.fetch("1265637138247057428");
            const role = await guild.roles.fetch("1408359506634866748");
            const member = await guild.members.fetch(interaction.user.id);
            await member.roles.add(role);

            interaction.reply({ content: `Mina鯖の伝説話者ロールを付与しました。`, flags: [MessageFlags.Ephemeral] });
        } catch (error) {
            console.error("Update Error:", error);
        }
    }
};