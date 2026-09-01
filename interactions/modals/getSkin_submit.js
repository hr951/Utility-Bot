const { image_embed_with_title } = require("../../utils/embeds");
const { fetchBedrockSkin } = require("../../utils/getMinecraftSkins");

module.exports = {
    async execute(interaction) {
        const mcid = interaction.fields.getTextInputValue("mcid");

        const skinImg = await fetchBedrockSkin(mcid);

        const embed = image_embed_with_title("スキンを取得しました", skinImg.textureURL, skinImg.dataURL);
        await interaction.reply({
            embeds: [embed]
        });
    }
};