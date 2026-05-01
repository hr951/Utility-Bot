const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const yts = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("曲を再生します")
    .addStringOption(option =>
      option
        .setName("query")
        .setDescription("URL または 検索ワード / 曲名の後ろに作者を入れると精度が上がります")
        .setRequired(true)
    ),

  async execute(interaction) {

    const kazagumo = interaction.client.kazagumo;
    const guildId = interaction.guild.id;
    const query = interaction.options.getString('query');

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.editReply({ content: "先にボイスチャンネルに入ってください", flags: [MessageFlags.Ephemeral] });
    }

    if (!global.customQueue.has(guildId)) global.customQueue.set(guildId, []);
    const queue = global.customQueue.get(guildId);

    queue.push({
      query: query,
      requester: interaction.user.tag
    });

    const player = await kazagumo.createPlayer({
      guildId: guildId,
      textId: interaction.channel.id,
      voiceId: interaction.member.voice.channel.id,
      deaf: true
    });

    if (!player.playing && !player.paused && queue.length === 1) {
      await playNext(player, kazagumo);
      return await interaction.editReply({ content: `**${query}** を追加しました\n※サーバーの稼働状況によって取得先が変わります`, flags: [MessageFlags.Ephemeral] });
    }

    return await interaction.editReply({ content: `**${query}** を追加しました\n※サーバーの稼働状況によって取得先が変わります`, flags: [MessageFlags.Ephemeral] });
  },
};

async function playNext(player, kazagumo) {
  const queue = global.customQueue.get(player.guildId);
  if (!queue || queue.length === 0) return;

  const current = queue[0];
  const homeIp = process.env.HOME_API_URL;
  const proxyUrl = `http://${homeIp}/stream?query=${encodeURIComponent(current.query)}`;

  let track = null;
  let metadata = null;

  try {
    const result = await kazagumo.search(proxyUrl, { engine: "http" });
    const infoRes = await fetch(`http://${homeIp}/info?query=${encodeURIComponent(current.query)}`);
    if (infoRes.ok) {
      metadata = await infoRes.json();

      if (await result.tracks.length > 0) {
        track = result.tracks[0];
        track.title = metadata.title;
        track.author = metadata.author;
        track.thumbnail = metadata.thumbnail;
        track.uri = metadata.url;
        track.length = metadata.duration;
        track.source = true;
      }
    }
  } catch (error) {
    console.error("自宅サーバーからの情報取得に失敗:", error.message);
  }

  if (!track) {
    // --- SoundCloud Author込み取得Ver ---
    // YouTubeから情報を取得
    const ytResult = await yts(current.query).catch(() => null);

    if (!ytResult || !ytResult.videos.length) {
      console.log("YouTube情報なし");
      queue.shift();
      playNext(player, kazagumo);
    }

    const video = ytResult.videos[0];
    const ytDurationMs = video.duration.seconds * 1000;

    // SoundCloudで検索
    const searchTitle = `${video.title} ${video.author.name}`;
    const res = await kazagumo.search(searchTitle, { engine: "soundcloud" });

    if (!res.tracks.length) {
      console.log("SoundCloud情報なし");
      queue.shift();
      playNext(player, kazagumo);
      return;
    }

    // カバー回避用フィルタ（秒数誤差15秒以内）
    track = res.tracks.find(t => Math.abs(t.length - ytDurationMs) < 15000) || res.tracks[0];
  }

  if (!track) {
    // --- SoundCloud Authorなし取得Ver ---
    // YouTubeから情報を取得
    const ytResult = await yts(current.query).catch(() => null);

    if (!ytResult || !ytResult.videos.length) {
      console.log("YouTube情報なし");
      queue.shift();
      playNext(player, kazagumo);
    }

    const video = ytResult.videos[0];
    const ytDurationMs = video.duration.seconds * 1000;

    // SoundCloudで検索
    const searchTitle = `${video.title}`;
    const res = await kazagumo.search(searchTitle, { engine: "soundcloud" });

    if (!res.tracks.length) {
      console.log("SoundCloud情報なし");
      queue.shift();
      playNext(player, kazagumo);
      return;
    }

    // カバー回避用フィルタ（秒数誤差15秒以内）
    track = res.tracks.find(t => Math.abs(t.length - ytDurationMs) < 15000) || res.tracks[0];
  }

  if (track) {
    player.play(track);
  } else {
    queue.shift();
    playNext(player, kazagumo);
  }
}

module.exports.playNext = playNext;
