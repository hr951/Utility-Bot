const { SlashCommandBuilder, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nte')
		.setDescription('NTEに関する機能です'),

	async execute(interaction) {

		const menu = new StringSelectMenuBuilder()
			.setCustomId("select_nte")
			.setPlaceholder("機能を選択")
			.addOptions(
				{
					label: "獲得ファンス量/週",
					value: "fonsPerWeek",
				},
				{
					label: "デイリーベーグル",
					value: "dailyBagel"
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
