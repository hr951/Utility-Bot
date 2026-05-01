const { MessageFlags, AttachmentBuilder } = require("discord.js");
const { getVideoHistory } = require("../../utils/getYoutubeData.js");
const { image_url_embed } = require("../../utils/embeds.js");
const { createGraph } = require("../../utils/createGraph.js");

module.exports = {
    async execute(interaction) {
        const id = interaction.fields.getTextInputValue("id");
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const data = await getVideoHistory(id);

        try {
            const canvas = createGraph(data, data[0][2]);
            const img = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: id + "_stats.png" });

            const embed = image_url_embed(data[0][2], `https://www.youtube.com/watch?v=${id}`, `attachment://${id}_stats.png`);

            await interaction.editReply({ embeds: [embed], files: [img], flags: [MessageFlags.Ephemeral] });
        } catch (error) {
            console.error(error);
        }
    }
};