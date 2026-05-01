const { SlashCommandBuilder, MessageFlags, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { getVideoList } = require("../utils/getYoutubeData.js");
const { msg2txt } = require("../utils/msg2txt.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('YouTubeの情報を取得するコマンドです')
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('情報選択画面を表示します')
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "stats") {
            const list = await getVideoList();

            const content = "動画名: ID\n" + Object.entries(list).map(([key, value]) => `${value}: ${key}`).join('\n');

            const Button = new ButtonBuilder()
                .setCustomId(`yt_video_stats`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel("IDを入力する");

            const file = msg2txt(content, "yt_videoIds");

            await interaction.editReply({ contents: "以下のテキストファイルから表示したい動画のIDを選択してください", files: [file], components: [new ActionRowBuilder().setComponents(Button)], flags: [MessageFlags.Ephemeral] });
        }
    }
}
