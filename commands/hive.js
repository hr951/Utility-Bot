const { SlashCommandBuilder, MessageFlags, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hive')
		.setDescription('Hiveに関する機能です'),

	async execute(interaction) {

		const menu = new StringSelectMenuBuilder()
			.setCustomId("select_hive")
			.setPlaceholder("機能を選択")
			.addOptions(
				{
					label: "勝率計算",
					value: "winRate",
				}
			);

		const row = new ActionRowBuilder().addComponents(menu);

		await interaction.reply({
			content: "以下から使用したい機能を選択してください",
			components: [row],
			flags: [MessageFlags.Ephemeral]
		});
	},
};
