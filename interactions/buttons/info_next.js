const { page1, page2, page3, page4 } = require('../../utils/pages.js');

module.exports = {
    async execute(interaction) {
        await interaction.deferUpdate();
        let page;
        let newPage;
        if (interaction.message.embeds[0].title.includes("1/")) {
            page = 1;
        } else if (interaction.message.embeds[0].title.includes("2/")) {
            page = 2;
        } else if (interaction.message.embeds[0].title.includes("3/")) {
            page = 3;
        } else if (interaction.message.embeds[0].title.includes("4/")) {
            page = 4;
        }
        switch (page) {
            case 1:
                newPage = await page2(interaction);
                break;
            case 2:
                newPage = await page3(interaction);
                break;
            case 3:
                newPage = await page4(interaction);
                break;
            case 4:
                newPage = await page1(interaction);
                break;
        }
        await interaction.editReply({ embeds: [newPage] });
    }
};