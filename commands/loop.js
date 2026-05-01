const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("ループモードを設定します")
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("ループモード")
                .setRequired(true)
                .addChoices(
                    { name: "off", value: "none" },
                    { name: "track", value: "track" },
                    { name: "queue", value: "queue" }
                )
        ),

    async execute(interaction) {
        const kazagumo = interaction.client.kazagumo;
        const player = kazagumo.players.get(interaction.guild.id);
        const mode = interaction.options.getString('mode');
        
        try {
            if (!player.queue.current) return interaction.reply({ content: "再生中の曲がありません", flags: [MessageFlags.Ephemeral] });
        } catch(error) {
            console.error(error);
            interaction.reply({ content: "再生中の曲がありません", flags: [MessageFlags.Ephemeral] });
            return;
        }

        global.loopSettings.set(interaction.guild.id, mode);

        const ja = {
            none: "オフ",
            track: "1曲リピート",
            queue: "全曲ループ"
        };

        return interaction.reply({ content: `ループモードを **${ja[mode]}** に設定しました`, flags: [MessageFlags.Ephemeral] });
    },
};