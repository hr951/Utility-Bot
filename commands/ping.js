const { SlashCommandBuilder } = require('discord.js');
const { basic_embed } = require("../utils/embeds.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pingを取得します'),

	async execute(interaction) {

		await interaction.reply({
			embeds: [basic_embed("Ping", `片道のPing : **${interaction.client.ws.ping}**ms\n往復のPing : **...**ms`)]
		});

		let msg = await interaction.fetchReply();

		await interaction.editReply({
			embeds: [basic_embed("Ping", `片道のPing : **${interaction.client.ws.ping}**ms\n往復のPing : **${msg.createdTimestamp - interaction.createdTimestamp}**ms`)]
		});

	},
};
