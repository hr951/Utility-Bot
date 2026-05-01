const { ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } = require("discord.js");
const { model } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        let points = 0;
        let bg = false;
        try {
            const msgPoint = await model.findOne({ _id: interaction.user.id });
            points = msgPoint.point;
            bg = msgPoint.bg_upgrade;
            if (isNaN(points)) {
                points = 0;
            }
            if (!bg) {
                bg = false;
            }
        } catch (error) {
            console.error(error);
        }
        if (bg) {
            const menu = new StringSelectMenuBuilder()
                .setCustomId("select_bg")
                .setPlaceholder("画像を選択してください")
                .addOptions(
                    {
                        label: "初期画像",
                        value: "1",
                    },
                    {
                        label: "集合写真",
                        value: "2",
                    },
                    {
                        label: "画像を登録する",
                        value: "3",
                    }
                );

            const row = new ActionRowBuilder().addComponents(menu);

            await interaction.reply({
                components: [row],
                flags: [MessageFlags.Ephemeral]
            });

            return;
        } else if (points < 200) {
            await interaction.reply({ content: `**${200 - points}**ポイント分不足しています。`, flags: [MessageFlags.Ephemeral] });
            return;
        }
        try {
            await model.findOneAndUpdate(
                { _id: interaction.user.id }, // 条件
                {
                    $set: {
                        name: interaction.user.username,
                        point: points - 200,
                        bg_upgrade: true,
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );

            const menu = new StringSelectMenuBuilder()
                .setCustomId("select_bg")
                .setPlaceholder("画像を選択してください")
                .addOptions(
                    {
                        label: "初期画像",
                        value: "1",
                    },
                    {
                        label: "集合写真",
                        value: "2",
                    },
                    {
                        label: "画像を登録する",
                        value: "3",
                    }
                );

            const row = new ActionRowBuilder().addComponents(menu);

            await interaction.reply({
                components: [row],
                flags: [MessageFlags.Ephemeral]
            });

        } catch (error) {
            console.error("Update Error:", error);
        }
    }
};