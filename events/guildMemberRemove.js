require("dotenv").config();

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        member.guild.channels.cache.get("id").send(`String`);
    },
};