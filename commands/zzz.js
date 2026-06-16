const { SlashCommandBuilder, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('zzz')
		.setDescription('ZZZに関する機能です'),

	async execute(interaction) {

		const menu = new StringSelectMenuBuilder()
			.setCustomId("select_zzz")
			.setPlaceholder("機能を選択")
			.addOptions(
				{
					label: "Undefined",
					value: "undefined",
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
