const { AttachmentBuilder } = require('discord.js');

function msg2txt(content, fileName) {
    const buffer = Buffer.from(content, 'utf-8');
    const attachment = new AttachmentBuilder(buffer, { name: `${fileName}.txt` });
    return attachment;
}

module.exports = { msg2txt };