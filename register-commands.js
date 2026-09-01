const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType } = require("discord.js");
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

const prestige = new SlashCommandBuilder()
	.setName('prestige')
	.setDescription('プレステージを適応します')
	.addStringOption(option =>
		option.setName("game")
			.setDescription("ゲームを選択してください")
			.setRequired(true)
			.addChoices(
				{ name: "BedWars", value: "bed" },
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
	]);

const commands = [genshin, hive, note, nte, wuwa, zzz, prestige];

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