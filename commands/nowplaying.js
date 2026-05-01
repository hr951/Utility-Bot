const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { np_embed } = require("../utils/embeds.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("現在再生中の曲を表示します"),

    async execute(interaction) {

        const kazagumo = interaction.client.kazagumo;
        const player = kazagumo.players.get(interaction.guild.id);

        if (!interaction.guild) return;

        if (!kazagumo.shoukaku.nodes.size) {
            return interaction.reply({ content: "再生サーバーに接続できていません。\n少し待ってからやり直してください。", flags: [MessageFlags.Ephemeral] });
        }

        try {
            if (!player.queue.current) return interaction.reply({ content: "再生中の曲がありません", flags: [MessageFlags.Ephemeral] });
        } catch(error) {
            console.error(error);
            interaction.reply({ content: "再生中の曲がありません", flags: [MessageFlags.Ephemeral] });
            return;
        }

        return interaction.reply({
            content: "再生中...",
            embeds: [np_embed(player.queue.current.title, player.queue.current.uri, "アーティスト: ", player.queue.current.author, "長さ: ", `${Math.floor(player.queue.current.length / 60000)}:${Math.floor((player.queue.current.length % 60000) / 1000).toString().padStart(2, '0')}`, player.queue.current.thumbnail, `Source: ${player.queue.current.source ? "YouTube" : "SoundCloud"}`)],
            flags: [MessageFlags.Ephemeral]
        });
    },
};