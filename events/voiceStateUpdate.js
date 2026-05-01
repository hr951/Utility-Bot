require("dotenv").config();
const { model } = require("../db/db");

const joinTimes = new Map();
const muteTimes = new Map();
const mutingTimes = new Map();

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        const player = client.kazagumo.players.get(oldState.guild.id);
        if (player) {

            const voiceChannel = client.channels.cache.get(player.voiceId);
            if (voiceChannel && voiceChannel.members.filter(m => !m.user.bot).size === 0) {
                player.destroy();
            }

            if (oldState.member.id === client.user.id && !newState.channelId) {
                const guildId = oldState.guild.id;

                if (global.customQueue && global.customQueue.has(guildId)) {
                    global.customQueue.delete(guildId);
                    console.log(`[VoiceState] ボットが切断されたため、キューを強制クリアしました。`);
                }
            }
        }

        const member = newState.member;
        if (member.user.bot) return;

        if (oldState.selfMute !== newState.selfMute) {
            const status = newState.selfMute ? "ミュート中" : "解除";
            console.log(`${newState.member.displayName} がマイクを ${status} にしました`);
            if (!oldState.selfMute && newState.selfMute) {
                muteTimes.set(member.id, Date.now());
            }
            if (oldState.selfMute && !newState.selfMute) {
                const muteTime = muteTimes.get(member.id);
                if (muteTimes) {
                    mutingTimes.set(member.id, Date.now() - muteTime + (mutingTimes.get(member.id) || 0));
                    muteTimes.delete(member.id);
                }
            }
        }

        if (oldState.selfDeaf !== newState.selfDeaf) {
            const status = newState.selfDeaf ? "OFF" : "ON";
            console.log(`${newState.member.displayName} がスピーカーを ${status} にしました`);
        }

        if (!oldState.channelId && newState.channelId) {
            joinTimes.set(member.id, Date.now());
            mutingTimes.set(member.id, 0);
        } else if (oldState.channelId && !newState.channelId) {
            const joinTime = joinTimes.get(member.id);
            if (joinTime) {
                const stayTime = Date.now() - joinTime;

                let mutingTime = mutingTimes.get(member.id) || 0;
                const muteTime = muteTimes.get(member.id);
                if (muteTime) {
                    mutingTime += (Date.now() - muteTime);
                }

                joinTimes.delete(member.id);
                muteTimes.delete(member.id);
                mutingTimes.delete(member.id);

                const tempTime = stayTime - mutingTime;
                const tempPoint = Math.floor((tempTime / 300_000) + (mutingTime / 900_000));

                try {
                    let vcTime = 0;
                    let vcPoint = 0;
                    let vcAllPoint = 0;
                    try {
                        const msgPoint = await model.findOne({ _id: member.id });
                        vcTime = msgPoint.vc_time;
                        vcPoint = msgPoint.vc_point;
                        vcAllPoint = msgPoint.vc_all_point;
                        if (!vcTime) {
                            vcTime = 0;
                        }
                        if (!vcPoint) {
                            vcPoint = 0;
                        }
                        if (!vcAllPoint) {
                            vcAllPoint = 0;
                        }
                    } catch (error) {
                        console.error(error);
                    }
                    await model.findOneAndUpdate(
                        { _id: member.id },
                        {
                            $set: {
                                display_name: member.displayName,
                                vc_point: vcPoint + tempPoint,
                                vc_all_point: vcAllPoint + tempPoint,
                                vc_time: vcTime + stayTime
                            },
                        },
                        { upsert: true, new: true }
                    );
                } catch (error) {
                    console.error(error);
                }
            }
        }
    },
};