const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { model, serverModel } = require('../db/db');
const { basic_embed } = require("../utils/embeds.js");
const { ms2time } = require("../utils/ms2time.js");

module.exports = {
    data: new SlashCommandBuilder()
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
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "all") {

            const [result] = await model.aggregate([
                {
                    $addFields: {
                        avgLength: {
                            $cond: {
                                if: { $eq: ["$msgcount", 0] },
                                then: 0,
                                else: { $divide: ["$msglength", "$msgcount"] }
                            }
                        }
                    }
                },
                {
                    $facet: {
                        top_avg: [
                            { $sort: { avgLength: -1 } },
                            { $limit: 1 },
                            { $project: { display_name: 1, avgLength: 1, _id: 0 } }
                        ],
                        top_msgcount: [
                            { $sort: { msgcount: -1 } },
                            { $limit: 1 },
                            { $project: { display_name: 1, msgcount: 1, _id: 0 } }
                        ],
                        top_allpoint: [
                            { $sort: { all_point: -1 } },
                            { $limit: 1 },
                            { $project: { display_name: 1, all_point: 1, _id: 0 } }
                        ],
                        top_point: [
                            { $sort: { point: -1 } },
                            { $limit: 1 },
                            { $project: { display_name: 1, point: 1, _id: 0 } }
                        ],
                        top_vcpoint: [
                            { $sort: { vc_point: -1 } },
                            { $limit: 1 },
                            { $project: { display_name: 1, vc_point: 1, _id: 0 } }
                        ],
                        top_vc_all_point: [
                            { $sort: { vc_all_point: -1 } },
                            { $limit: 1 },
                            { $project: { display_name: 1, vc_all_point: 1, _id: 0 } }
                        ],
                        top_vc_time: [
                            { $sort: { vc_time: -1 } },
                            { $limit: 1 },
                            { $project: { display_name: 1, vc_time: 1, _id: 0 } }
                        ]
                    }
                }
            ]);

            if (!result) {
                return interaction.reply({ content: 'データがありません。', flags: [MessageFlags.Ephemeral] });
            }

            const description = `**AllMSGPoint TOP:** ${result.top_allpoint[0]?.display_name || '不明'}: **${result.top_allpoint[0]?.all_point || 0}**\n` +
                `**MSGPoint TOP:** ${result.top_point[0]?.display_name || '不明'}: **${result.top_point[0]?.point || 0}**\n` +
                `**MSG数 TOP:** ${result.top_msgcount[0]?.display_name || '不明'}: **${result.top_msgcount[0]?.msgcount || 0}**\n` +
                `**MSG平均長さ TOP:** ${result.top_avg[0]?.display_name || '不明'}: **${result.top_avg[0]?.avgLength?.toFixed(2) || 0}**\n` +
                `**AllVCPoint TOP:** ${result.top_vc_all_point[0]?.display_name || '不明'}: **${result.top_vc_all_point[0]?.vc_all_point || 0}**\n` +
                `**VCPoint TOP:** ${result.top_vcpoint[0]?.display_name || '不明'}: **${result.top_vcpoint[0]?.vc_point || 0}**\n` +
                `**VC滞在時間 TOP:** ${result.top_vc_time[0]?.display_name || '不明'}: **${ms2time(result.top_vc_time[0]?.vc_time) || 0}**`;

            await interaction.reply({ embeds: [basic_embed("各部門TOP", description)] });

        } else if (subcommand === "category") {
            const sort = interaction.options.getString('sort');
            const number = interaction.options.getString('number');
            let topUsers;

            if (sort === 'averagemsg') {
                topUsers = await model.aggregate([
                    {
                        $addFields: {
                            avgLength: {
                                $cond: {
                                    if: { $eq: ["$msgcount", 0] },
                                    then: 0,
                                    else: { $divide: ["$msglength", "$msgcount"] }
                                }
                            }
                        }
                    },
                    { $sort: { avgLength: -1 } },
                    { $limit: Number(number) },
                    { $project: { display_name: 1, avgLength: 1 } }
                ]);
            } else {
                topUsers = await model.find({}, { display_name: 1, [sort]: 1 })
                    .sort({ [sort]: -1 })
                    .limit(number);
            }

            if (!topUsers.length) {
                return interaction.reply({ content: 'ランキングデータがまだありません。', flags: [MessageFlags.Ephemeral] });
            }

            let description = '';
            topUsers.forEach((user, i) => {
                let value;
                if (sort === "averagemsg") {
                    value = user.avgLength?.toFixed(2) || 0;
                } else if (sort === "vc_time") {
                    value = ms2time(user[sort] ?? 0);
                } else {
                    value = user[sort]?.toLocaleString?.() ?? 0;
                }
                description += `**${i + 1}.** ${user.display_name || "不明"}: **${value}**\n`;
            });

            const title = `${sort === 'point' ? 'MSGPoint' : sort === 'all_point' ? 'AllMSGPoint' : sort === 'msgcount' ? 'MSG数' : sort === 'averagemsg' ? 'MSG平均長さ' : sort === 'vc_point' ? 'VCPoint' : sort === 'vc_all_point' ? 'AllVCPoint' : sort === 'vc_time' ? 'VC滞在時間' : "Undefined"}ランキング`;

            await interaction.reply({ embeds: [basic_embed(title, description)] });

        } else if (subcommand === "commands") {
            let useCmd = {};
            const serverConfig = await serverModel.findOne({ _id: "1265637138247057428" });
            useCmd = serverConfig.commands_use;
            const total = useCmd.total;

            const rankCmd = Object.entries(useCmd).filter(([name]) => name !== "total").sort((a, b) => b[1] - a[1]);
            const description = `**Total**: ${total}回\n` + rankCmd.map(([name, count], index) => `${index + 1}. **${name}**: ${count || 0}回 (${((count || 0) / total * 100).toFixed(1)}%)`).join('\n');

            const title = `コマンド使用率ランキング`;

            await interaction.reply({ embeds: [basic_embed(title, description)] });
        }
    }
}
