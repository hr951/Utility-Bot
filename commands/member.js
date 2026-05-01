const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('member')
        .setDescription('勢力ごとのメンバーを表示します'),

    async execute(interaction) {

        const thumbnail = interaction.client.user.displayAvatarURL();
        const color = "#ffffff";

        var member_1 = "なし";
        var member_2 = "なし";
        var member_3 = "なし";
        var member_4 = "なし";

        const role_1 = await interaction.guild.roles.fetch('1265668863597740225');
        if (role_1.members.size !== 0) {
            member_1 = await role_1.members.map(m => m.nickname || m.user.globalName).join('\n');
        } else {
            member_1 = "なし";
        };

        const role_2 = await interaction.guild.roles.fetch('1265668095427612703');
        if (role_2.members.size !== 0) {
            member_2 = await role_2.members.map(m => m.nickname || m.user.globalName).join('\n');
        } else {
            member_2 = "なし";
        };

        const role_3 = await interaction.guild.roles.fetch('1268835638686257203');
        if (role_3.members.size !== 0) {
            member_3 = await role_3.members.map(m => m.nickname || m.user.globalName).join('\n');
        } else {
            member_3 = "なし";
        };

        const role_4 = await interaction.guild.roles.fetch('1353728683357114369');
        if (role_4.members.size !== 0) {
            member_4 = await role_4.members.map(m => m.nickname || m.user.globalName).join('\n');
        } else {
            member_4 = "なし";
        };

        const embed = new EmbedBuilder()
            .setTitle("勢力に加入しているメンバー")
            .addFields(
                {
                    name: `**${role_1.name}** (**${role_1.members.size}**人)`,
                    value: member_1,
                    inline: true
                },
                {
                    name: `**${role_2.name}** (**${role_2.members.size}**人)`,
                    value: member_2,
                    inline: true
                },
                {
                    name: `**${role_3.name}** (**${role_3.members.size}**人)`,
                    value: member_3,
                    inline: true
                },
                {
                    name: `**${role_4.name}** (**${role_4.members.size}**人)`,
                    value: member_4,
                    inline: true
                },
            )
            .setColor(color)
            .setFooter({
                text: "Made by Mina鯖 Bot",
                iconURL: thumbnail,
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] })

    },
};
