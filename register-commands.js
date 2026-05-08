const { SlashCommandBuilder } = require("discord.js");
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = "clientId";
const guildId = "guildId";

// ----- グローバルコマンドここから-----
const ping = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Pingを取得します');

const top = new SlashCommandBuilder()
	.setName('top')
	.setDescription('チャンネルの最初のメッセージを取得します');

const example = new SlashCommandBuilder()
	.setName('example')
	.setDescription('description')
	.addSubcommand(subcommand =>
		subcommand
			.setName('sub1')
			.setDescription('sub1 description')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('user description')
					.setRequired(false)
			)
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('sub2')
			.setDescription('sub2 description')
	);

const commands = [ping, top, example];

// ----- ギルド専用コマンドここから-----
const example = new SlashCommandBuilder()
	.setName('example')
	.setDescription('勢力ごとのメンバーを表示します');

const commands_guild = [example];

// 登録用関数
const { REST, Routes } = require("discord.js")
const rest = new REST({ version: '10' }).setToken(token)
async function main() {
	await rest.put(
		Routes.applicationCommands(clientId),
		{ body: commands },
	);
	await rest.put(
		Routes.applicationGuildCommands(clientId, guildId),
		{ body: commands_guild },
	);
}

main().catch(err => custom.error(err.message, ""));