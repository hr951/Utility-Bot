const { SlashCommandBuilder } = require("discord.js");
require('dotenv').config();
require('./utils/createLogs');

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = "1421462676458176532";
const guildId = "1040937611390353408";

// ----- グローバルコマンドここから-----
const genshin = new SlashCommandBuilder()
	.setName('genshin')
	.setDescription('原神に関する機能です');

const hive = new SlashCommandBuilder()
	.setName('hive')
	.setDescription('Hiveに関する機能です');

const note = new SlashCommandBuilder()
	.setName('note')
	.setDescription('メモに関する機能です');

const nte = new SlashCommandBuilder()
	.setName('nte')
	.setDescription('NTEに関する機能です');

const wuwa = new SlashCommandBuilder()
	.setName('wuwa')
	.setDescription('鳴潮に関する機能です');

const zzz = new SlashCommandBuilder()
	.setName('zzz')
	.setDescription('ZZZに関する機能です');

const commands = [genshin, hive, note, nte, wuwa, zzz];

// ----- ギルド専用コマンドここから-----
const example = new SlashCommandBuilder()
	.setName('example')
	.setDescription('勢力ごとのメンバーを表示します');

const commands_guild = [];

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