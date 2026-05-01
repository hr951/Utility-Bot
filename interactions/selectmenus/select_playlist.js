const { MessageFlags } = require("discord.js");
const { model } = require('../../db/db');
const yts = require('yt-search');
let playListData = require('../../data/playList.json');

module.exports = {
    async execute(interaction) {
        const kazagumo = interaction.client.kazagumo;
        const guildId = interaction.guild.id;
        const value = interaction.values[0];
        let userPlayList = {};

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        try {
            const msgPoint = await model.findOne({ _id: interaction.user.id });
            userPlayList = JSON.parse(msgPoint.playlist);
            if (!userPlayList) {
                userPlayList = null;
            }

            const dbDataFormatted = {};
            Object.entries(await userPlayList).forEach(([id, content]) => {
                dbDataFormatted[id] = content;
            });
            playListData = { ...playListData, ...dbDataFormatted };

        } catch (error) {
            console.error(error);
        }

        const playList = playListData[value];

        if (global.customQueue && global.customQueue.has(guildId)) {
            global.customQueue.delete(guildId);
        }

        global.customQueue.set(guildId, []);
        const queue = global.customQueue.get(guildId);

        Object.values(playList.list).forEach((url) => {
            queue.push({
                query: url,
                requester: interaction.user.tag
            });
        });

        const player = await kazagumo.createPlayer({
            guildId: guildId,
            textId: interaction.channel.id,
            voiceId: interaction.member.voice.channel.id,
            deaf: true
        });

        if (!player.playing && !player.paused) {
            await playNext(player, kazagumo);
            return await interaction.editReply({ content: `再生リスト: **${playList.name}** を追加しました\n※サーバーの稼働状況によって取得先が変わります`, flags: [MessageFlags.Ephemeral] });
        }

        return await interaction.editReply({ content: `再生リスト: **${playList.name}** を追加しました\n※サーバーの稼働状況によって取得先が変わります`, flags: [MessageFlags.Ephemeral] });
    },
}

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
};