const { EmbedBuilder, MessageFlags } = require("discord.js");
const color = "#FFFFFF";

module.exports = {
    async execute(interaction, client) {
        if (!interaction.member.roles.cache.has('1307226905862340608')) {
            await interaction.reply({ content: "チャンネルを削除する権限がありません。", flags: [MessageFlags.Ephemeral] });
            return;
        } else {
            const delmsg = new EmbedBuilder()
                .addFields({
                    name: " ",
                    value: `<@${interaction.user.id}>がチケット「**${interaction.channel.name}**」を削除しました。`,
                    inline: true
                })
                .setColor(color);
            client.channels.cache.get("1307705261544308807").send({ embeds: [delmsg] })
            interaction.channel.delete();
        }
    }
};