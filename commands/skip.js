const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("曲をスキップします"),

    async execute(interaction) {

        const kazagumo = interaction.client.kazagumo;
        const player = kazagumo.players.get(interaction.guild.id);

        const queue = global.customQueue.get(interaction.guild.id);

        if (!player || !queue || queue.length === 0) {
            return interaction.reply({ content: "再生中の曲がありません", flags: [MessageFlags.Ephemeral] });
        }

        if (queue.length > 1) {
            player.skip();
            return interaction.reply({ content: "曲をスキップしました", flags: [MessageFlags.Ephemeral] });
        } else {
            queue.shift();
            player.destroy();
            return interaction.reply({ content: "最後の曲をスキップして停止しました", flags: [MessageFlags.Ephemeral] });
        }
    },
};