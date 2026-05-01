const { EmbedBuilder } = require("discord.js");
const color = "#ffffff";

function basic_embed(title, description) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();

    return embed;
};

/*
const fields = [
    { name: "Name", value: "Value" },
    { name: "Name", value: "Value" },
    { name: "Name", value: "Value" }
];
*/
function fields_embed(title, description, fields) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setTimestamp();

    if (description) {
        embed.setDescription(description);
    }

    if (Array.isArray(fields)) {
        const formattedFields = fields.map(f => ({
            name: f.name,
            value: f.value,
            inline: true
        }));
        embed.addFields(formattedFields);
    }

    return embed;
};

function image_url_embed(title, url, image) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setURL(url)
        .setColor(color)
        .setImage(image)
        .setTimestamp();

    return embed;
};

module.exports = {
    basic_embed,
    fields_embed,
    image_url_embed
};