const { SlashCommandBuilder } = require("discord.js");
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = "1307701661447360595";
const guildId = "1265637138247057428";

// ----- グローバルコマンドここから-----
const ping = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Pingを取得します');

const top = new SlashCommandBuilder()
	.setName('top')
	.setDescription('チャンネルの最初のメッセージを取得します');

const point = new SlashCommandBuilder()
	.setName('point')
	.setDescription('ポイント関連のコマンドです')
	.addSubcommand(subcommand =>
		subcommand
			.setName('view')
			.setDescription('ユーザーのポイントを表示します')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('対象のユーザー')
					.setRequired(false)
			)
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('use')
			.setDescription('ポイントを利用します')
	);

const lb = new SlashCommandBuilder()
	.setName('lb')
	.setDescription('ポイント関連のコマンドです')
	.addSubcommand(subcommand =>
		subcommand
			.setName('all')
			.setDescription('各部門首位を表示します')
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('category')
			.setDescription('それぞれの部門のランキングです')
			.addStringOption(option => option
				.setName("sort")
				.setDescription("ソートする内容を選択してください")
				.setRequired(true)
				.addChoices(
					{ name: "MSGPoint", value: "point" },
					{ name: "MSGcount", value: "msgcount" },
					{ name: "AllMSGPoint", value: "all_point" },
					{ name: "AvgMSGlength", value: "averagemsg" },
					{ name: "VCPoint", value: "vc_point" },
					{ name: "AllVCPoint", value: "vc_all_point" },
					{ name: "VCStayTime", value: "vc_time" }
				)
			)
			.addStringOption(option => option
				.setName("number")
				.setDescription("ソートする数量を選択してください")
				.setRequired(true)
				.addChoices(
					{ name: "TOP20", value: "20" },
					{ name: "TOP10", value: "10" },
					{ name: "TOP5", value: "5" }
				)
			)
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('commands')
			.setDescription('コマンドの使用率を表示します')
	);

const profile = new SlashCommandBuilder()
	.setName('profile')
	.setDescription('プロフィール画像を作成します')
	.addStringOption(option =>
		option.setName('minecraft-id')
			.setDescription('マイクラのIDを書いてください')
			.setRequired(true)
	)
	.addStringOption(option =>
		option.setName('comment')
			.setDescription('ひとことを書いてください')
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("sns1")
			.setDescription("使用しているSNSを選択してください")
			.setRequired(false) //trueで必須、falseで任意
			.addChoices(
				{ name: "Twitter", value: "x" },
				{ name: "Youtube", value: "yt" },
				{ name: "Discord", value: "discord" },
				{ name: "Scratch", value: "sc" },
				{ name: "Instagram", value: "ig" },
				{ name: "TikTok", value: "tt" }
			)
	)
	.addStringOption((option) =>
		option
			.setName("sns2")
			.setDescription("使用しているSNSを選択してください")
			.setRequired(false) //trueで必須、falseで任意
			.addChoices(
				{ name: "Twitter", value: "x" },
				{ name: "Youtube", value: "yt" },
				{ name: "Discord", value: "discord" },
				{ name: "Scratch", value: "sc" },
				{ name: "Instagram", value: "ig" },
				{ name: "TikTok", value: "tt" }
			)
	)
	.addStringOption((option) =>
		option
			.setName("sns3")
			.setDescription("使用しているSNSを選択してください")
			.setRequired(false) //trueで必須、falseで任意
			.addChoices(
				{ name: "Twitter", value: "x" },
				{ name: "Youtube", value: "yt" },
				{ name: "Discord", value: "discord" },
				{ name: "Scratch", value: "sc" },
				{ name: "Instagram", value: "ig" },
				{ name: "TikTok", value: "tt" }
			)
	);

const search = new SlashCommandBuilder()
	.setName("search")
	.setDescription("曲を検索して再生します")
	.addStringOption(option =>
		option
			.setName("query")
			.setDescription("URL または 検索ワード / 曲名の後ろに作者を入れると精度が上がります")
			.setRequired(true)
	);

const nowplaying = new SlashCommandBuilder()
	.setName("nowplaying")
	.setDescription("現在再生中の曲を表示します");

const queue = new SlashCommandBuilder()
	.setName("queue")
	.setDescription("再生キューを表示します");

const skip = new SlashCommandBuilder()
	.setName("skip")
	.setDescription("曲をスキップします");

const loop = new SlashCommandBuilder()
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
	);

const stop = new SlashCommandBuilder()
	.setName("stop")
	.setDescription("曲を停止し、VCから退出します");

const info = new SlashCommandBuilder()
	.setName("info")
	.setDescription("Mina鯖 Botの情報を表示します");

const play = new SlashCommandBuilder()
	.setName("play")
	.setDescription("プレイリストから再生します");

const playlist = new SlashCommandBuilder()
	.setName("playlist")
	.setDescription("ユーザープレイリストを編集・設定します");

const youtube = new SlashCommandBuilder()
	.setName('youtube')
	.setDescription('YouTubeの情報を取得するコマンドです')
	.addSubcommand(subcommand =>
		subcommand
			.setName('stats')
			.setDescription('情報選択画面を表示します')
	);

const commands = [ping, top, point, lb, profile, search, nowplaying, queue, skip, loop, stop, info, play, playlist, youtube];

// ----- ギルド専用コマンドここから-----
const member = new SlashCommandBuilder()
	.setName('member')
	.setDescription('勢力ごとのメンバーを表示します');

const update_server = new SlashCommandBuilder()
	.setName('update-server')
	.setDescription('サーバーステータスを最新の状態にします');

const commands_guild = [update_server];

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

main().catch(err => console.log(err));