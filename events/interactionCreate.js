const { MessageFlags } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`${interaction.commandName} が見つかりません。`);
                return;
            }
            try {
                await command.execute(interaction, client);
            } catch (error) {
                try {
                    await interaction.reply({ content: 'Error', flags: [MessageFlags.Ephemeral] });
                    console.error(error);
                } catch (error) {
                    try {
                        await interaction.editReply({ content: 'Error', flags: [MessageFlags.Ephemeral] });
                        console.error(error);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        };

        if (interaction.isButton()) {
            if (interaction.user.id === interaction.customId) { // ユーザーIDを使うため特例
                return await interaction.message.delete();
            }

            try {
                const button = require(`../interactions/buttons/${interaction.customId}.js`);
                await button.execute(interaction, client);
            } catch (error) {
                console.error(`${interaction.customId} が見つかりません\n` + error);
                interaction.reply({ content: "Error", flags: [MessageFlags.Ephemeral] });
                return;
            }
        }

        if (interaction.isModalSubmit()) {
            try {
                const modal = require(`../interactions/modals/${interaction.customId}.js`);
                await modal.execute(interaction, client);
            } catch (error) {
                console.error(`${interaction.customId} が見つかりません\n` + error);
                interaction.reply({ content: "Error", flags: [MessageFlags.Ephemeral] });
                return;
            }
        }

        if (interaction.isStringSelectMenu()) {
            try {
                const selectmenu = require(`../interactions/selectmenus/${interaction.customId}.js`);
                await selectmenu.execute(interaction, client);
            } catch (error) {
                console.error(`${interaction.customId} が見つかりません\n` + error);
                interaction.reply({ content: "Error", flags: [MessageFlags.Ephemeral] });
                return;
            }
        }
    },
};