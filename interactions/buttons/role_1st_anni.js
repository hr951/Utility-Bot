const { MessageFlags } = require("discord.js");
const { model } = require('../../db/db');

module.exports = {
    async execute(interaction, client) {
        let points = 0;
        let anni_role = false;
        try {
            const msgPoint = await model.findOne({ _id: interaction.user.id });
            points = msgPoint.point;
            anni_role = msgPoint.anni_role;

            if (isNaN(points)) {
                points = 0;
            }
            if (!anni_role) {
                anni_role = false;
            }
        } catch (error) {
            console.error(error);
        }
        if (anni_role) {
            await interaction.reply({ content: `すでに有効化されています。`, flags: [MessageFlags.Ephemeral] });
            return;
        } else if (points < 1) {
            await interaction.reply({ content: `**${1 - points}**ポイント分不足しています。`, flags: [MessageFlags.Ephemeral] });
            return;
        }
        try {
            await model.findOneAndUpdate(
                { _id: interaction.user.id }, // 条件
                {
                    $set: {
                        name: interaction.user.username,
                        point: points - 1,
                        anni_role: true
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );

            const guild = await client.guilds.fetch("1265637138247057428");
            const role = await guild.roles.fetch("1446401161161605170");
            const member = await guild.members.fetch(interaction.user.id);
            await member.roles.add(role);

            interaction.reply({ content: `運用1周年記念ロールを付与しました。`, flags: [MessageFlags.Ephemeral] });
        } catch (error) {
            console.error("Update Error:", error);
        }
    }
};