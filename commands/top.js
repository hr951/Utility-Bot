const { SlashCommandBuilder } = require('discord.js');
const { top_embed } = require('../utils/embeds.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('チャンネルの一番上のメッセージのリンクを送信します'),
  async execute(interaction) {
    const channel = interaction.channel;
    const messages = await channel.messages.fetch({ after: '0', limit: 1 });
    const message = messages.first();
    const link = message.url;

    await interaction.reply({
      embeds: [top_embed("チャンネル最上部へ", link)],
      allowedMentions: { repliedUser: false }
    });
  },
};
