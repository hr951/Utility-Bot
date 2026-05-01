require("dotenv").config();

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        member.guild.channels.cache.get("id").send({
            content: `String`
        });
    },
};