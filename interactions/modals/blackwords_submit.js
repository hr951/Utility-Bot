const { MessageFlags } = require("discord.js");
const { serverModel } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        const exact = interaction.fields.getTextInputValue("exact");
        const partial = interaction.fields.getTextInputValue("partial");

        const arrayExact = exact.split('\n');
        const arrayPartial = partial.split('\n');

        const blackWords = JSON.stringify({
            "ExactMatch": arrayExact,
            "PartialMatch": arrayPartial
        });

        try {
            await serverModel.findOneAndUpdate(
                { _id: "1265637138247057428" },
                {
                    $set: {
                        black_words: blackWords
                    },
                },
                { upsert: true, new: true }
            );
            interaction.reply({ content: `NGワードを更新しました`, flags: [MessageFlags.Ephemeral] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: `NGワードの更新に失敗しました`, flags: [MessageFlags.Ephemeral] });
        }
    }
};