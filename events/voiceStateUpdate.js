require("dotenv").config();

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {

        const member = newState.member;
        if (member.user.bot) return;

        if (oldState.selfMute !== newState.selfMute) {
            const status = newState.selfMute ? "ミュート中" : "解除";
            console.log(`${newState.member.displayName} がマイクを ${status} にしました`);
        }

        if (oldState.selfDeaf !== newState.selfDeaf) {
            const status = newState.selfDeaf ? "OFF" : "ON";
            console.log(`${newState.member.displayName} がスピーカーを ${status} にしました`);
        }
    },
};