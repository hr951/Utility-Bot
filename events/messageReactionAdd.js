require("dotenv").config();

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user, client) {
        const react_message = reaction.message;
        react_message.guild.members.resolve(user);
        console.log(`${reaction.message.guild} で ${user.displayName} が ${reaction.emoji.name} をリアクションしました`);
        /*if (user.id === "1225452488237514763" || user.id === "962670040795201557") return;
        if (reaction.emoji.name === '🖕') {
            react_message.reactions.cache.get('🖕').remove();
            client.channels.cache.get("1380894393611059241").send(`${user.displayName} が https://discord.com/channels/${reaction.message.guild.id}/${react_message.channel.id}/${react_message.id} に ${reaction.emoji.name} を リアクションしました。`);
        }*/
    },
};