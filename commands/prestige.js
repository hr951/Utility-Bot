const { SlashCommandBuilder, MessageFlags, ApplicationIntegrationType, InteractionContextType } = require('discord.js');
const { prestigeCTF } = require('../utils/prestige/ctf');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('prestige')
	.setDescription('プレステージを適応します')
	.addStringOption(option =>
		option.setName("game")
			.setDescription("ゲームを選択してください")
			.setRequired(true)
			.addChoices(
				{ name: "Bed Wars", value: "bed" },
				{ name: "Block Drop", value: "drop" },
				{ name: "Block Party", value: "party" },
				{ name: "The Bridge", value: "bridge" },
				{ name: "Build Battle", value: "build" },
				{ name: "Capture The Flag", value: "ctf" },
				{ name: "Death Run", value: "dr" },
				{ name: "Gravity", value: "grav" },
				{ name: "Ground Wars", value: "ground" },
				{ name: "Hide And Seek", value: "hide" },
				{ name: "Murder Mystery", value: "mm" },
				{ name: "SkyWars", value: "sky" },
				{ name: "Survival Games", value: "sg" }
			)
	)
	.addStringOption(option =>
		option.setName('name')
			.setDescription('ユーザー名')
			.setRequired(true)
	)
	.setIntegrationTypes([
		ApplicationIntegrationType.GuildInstall,
		ApplicationIntegrationType.UserInstall
	])
	.setContexts([
		InteractionContextType.Guild,
		InteractionContextType.BotDM,
		InteractionContextType.PrivateChannel
	]),

    async execute(interaction) {
        const name = interaction.options.getString('name');

        await interaction.deferReply();

        try {
            const attachment = await prestigeCTF(name);

            await interaction.editReply({
                content: "",
                files: [attachment]
            });

        } catch (error) {
            custom.error(error);
            await interaction.editReply({
                content: `❌ **${name}** のデータ取得に失敗しました。`,
                flags: [MessageFlags.Ephemeral]
            });
            return;
        }
    }
};