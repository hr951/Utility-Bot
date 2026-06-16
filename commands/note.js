const { SlashCommandBuilder, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('note')
		.setDescription('メモに関する機能です'),

	async execute(interaction) {

		const menu = new StringSelectMenuBuilder()
			.setCustomId("select_note")
			.setPlaceholder("機能を選択")
			.addOptions(
				{
					label: "ToDoリスト",
					value: "todoList",
				},
				{
					label: "リンクまとめ",
					value: "linkSummary",
				},
				{
					label: "メモ",
					value: "note",
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
