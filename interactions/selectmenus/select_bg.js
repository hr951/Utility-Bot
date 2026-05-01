const { model } = require('../../db/db');
const sizeOf = require("image-size").default;

module.exports = {
    async execute(interaction) {
        const value = interaction.values[0];
        const name = {
            0: "初期画像",
            1: "集合写真"
        };

        let image_url = "undefined";

        if (value === "3") {
            await interaction.reply("60秒以内に画像を送信してください");

            const channel = interaction.channel;
            const userId = interaction.user.id;

            const filter = (msg) =>
                msg.author.id === userId && msg.attachments.size > 0;

            try {
                const collected = await channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 60_000, // 60秒待ち
                    errors: ["time"],
                });

                const msg = collected.first();
                const attachment = msg.attachments.first();

                const filename = attachment.name.toLowerCase();
                const type = attachment.contentType?.toLowerCase() || "";

                if (
                    !(
                        filename.endsWith(".png") ||
                        filename.endsWith(".jpg") ||
                        filename.endsWith(".jpeg") ||
                        type.includes("png") ||
                        type.includes("jpeg") ||
                        type.includes("jpg")
                    )
                ) {
                    await interaction.followUp("対応していないファイル形式です\n**__png/jpg/jpeg__**のファイル形式の画像を用意してください");
                    return;
                }

                const imgBuffer = await fetch(attachment.url).then((r) => r.arrayBuffer());
                const dimensions = sizeOf(Buffer.from(imgBuffer));

                const { width, height } = dimensions;

                const image = await interaction.followUp({
                    content: `以下の画像を登録しました！(${width}x${height})`,
                    files: [attachment.url],
                });

                image_url = image.attachments.first().attachment;

                console.log(image_url)

            } catch (error) {
                console.log(error);
                await interaction.followUp("60秒以内に画像が送信されませんでした");
            }
        } else {
            image_url = "undefined";
        }

        try {

            try {
                await model.findOne({ _id: interaction.user.id });
            } catch (error) {
                console.error(error);
            }
            await model.findOneAndUpdate(
                { _id: interaction.user.id }, // 条件
                {
                    $set: {
                        name: interaction.user.username,
                        bg_type: value - 1,
                        bg_url: image_url
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );
            if (value != 3) {
                await interaction.reply(`プロフィール背景を**${name[value - 1]}**に設定しました`);
            }
            //console.log("Update the DataBase:", msgData);
        } catch (error) {
            console.error("Update Error:", error);
        }

    }
};