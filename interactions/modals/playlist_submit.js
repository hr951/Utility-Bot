const { MessageFlags } = require('discord.js');
const { model } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        const name = interaction.fields.getTextInputValue("name");
        const description = interaction.fields.getTextInputValue("description");
        const list = interaction.fields.getTextInputValue("list");
        const formattedList = list
            .split('\n')
            .map(url => url.trim())
            .filter(url => url !== "")
            .reduce((acc, url, index) => {
                acc[index + 1] = url;
                return acc;
            }, {});

        const userPlayList = JSON.stringify({
            ["PlayList" + interaction.user.id]: {
                name: name,
                description: description,
                list: formattedList
            }
        });

        try {
            await model.findOneAndUpdate(
                { _id: interaction.user.id }, // 条件
                {
                    $set: {
                        playlist: userPlayList
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );
            interaction.reply({ content: `ユーザープレイリストを更新しました`, flags: [MessageFlags.Ephemeral] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: `ユーザープレイリストの更新に失敗しました`, flags: [MessageFlags.Ephemeral] });
        }
    },
}