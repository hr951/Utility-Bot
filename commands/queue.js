const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { queue_embed } = require('../utils/embeds.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("再生キューを表示します"),

    async execute(interaction) {
        const queue = global.customQueue.get(interaction.guild.id);
        const loopMode = global.loopSettings.get(interaction.guild.id) || "none";

        const ja = {
            none: "オフ",
            track: "1曲リピート",
            queue: "全曲ループ"
        };

        if (!queue || queue.length === 0) return interaction.reply({ content: "キューは空です", flags: [MessageFlags.Ephemeral] });

        const list = queue.map((item, index) => `${index + 1}. **${item.query}**`).join("\n");

        return interaction.reply({
            embeds: [queue_embed("再生キュー (1. は再生中)", list, `ループモード: ${ja[loopMode]}`)],
            flags: [MessageFlags.Ephemeral]
        });
    },
};