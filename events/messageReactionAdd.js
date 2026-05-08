require("dotenv").config();

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user, client) {
        const react_message = reaction.message;
        react_message.guild.members.resolve(user);
        custom.log(`${reaction.message.guild} で ${user.displayName} が ${reaction.emoji.name} をリアクションしました`);
    },
};