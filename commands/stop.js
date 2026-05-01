const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("曲を停止し、VCから退出します"),

    async execute(interaction) {

        const kazagumo = interaction.client.kazagumo;
        const player = kazagumo.players.get(interaction.guild.id);

        if (!interaction.guild) return;

        if (!kazagumo.shoukaku.nodes.size) {
            return interaction.reply({ content: "再生サーバーに接続できていません。\n少し待ってからやり直してください。", flags: [MessageFlags.Ephemeral] });
        }

        if (!player) return interaction.reply({ content: "再生中の曲がありません", flags: [MessageFlags.Ephemeral] });
        player.destroy();

        return interaction.reply({ content: "再生を停止し、退出しました", flags: [MessageFlags.Ephemeral] });
    },
};