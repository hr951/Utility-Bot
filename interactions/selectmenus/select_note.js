const { ModalBuilder, TextInputBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const { basic_embed } = require("../../utils/embeds");
const path = require('path');
const fs = require("fs");

const note_modules = [
    "todoList",
    "linkSummary",
    "note",
    "msgCmd"
];

module.exports = {
    async execute(interaction) {
        const value = interaction.values[0];

        if (value === note_modules[0]) {

        } else if (value === note_modules[1]) {
            const links = path.join(__dirname, '..', '..', 'data', 'links.json');
            const links_json = JSON.parse(fs.readFileSync(links, 'utf8'));
        } else if (value === note_modules[2]) {
            const note = path.join(__dirname, '..', '..', 'data', 'note.json');
            const note_json = JSON.parse(fs.readFileSync(note, 'utf8'));
        } else if (value === note_modules[3]) {
            const msgCmdList = path.join(__dirname, '..', '..', 'data', 'msgCmd.json');
            const msgCmdList_json = JSON.parse(fs.readFileSync(msgCmdList, 'utf8'));

            const lines = [];
            for (const [key, values] of Object.entries(msgCmdList_json)) {
                const itemsStr = [];

                for (const item of values) {
                    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                        for (const [subKey, subValues] of Object.entries(item)) {
                            const subItems = subValues.join('\n> ');
                            itemsStr.push(`### ↳${subKey}\n> ${subItems}`);
                        }
                    } else {
                        itemsStr.push(`> !${item}`);
                    }
                }

                lines.push(`## ${key}\n${itemsStr.join('\n')}`);
            }

            await interaction.reply({
                embeds: [basic_embed("メッセージコマンド リスト", lines.join("\n"))]
            });
        }

    }
};