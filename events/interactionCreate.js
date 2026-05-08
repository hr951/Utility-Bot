const { MessageFlags } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                custom.error(`${interaction.commandName} が見つかりません。`, "");
                return;
            }
            try {
                await command.execute(interaction, client);
            } catch (error) {
                try {
                    await interaction.reply({ content: 'Error', flags: [MessageFlags.Ephemeral] });
                    custom.error(error.message, "");
                } catch (error) {
                    try {
                        await interaction.editReply({ content: 'Error', flags: [MessageFlags.Ephemeral] });
                        custom.error(error.message, "");
                    } catch (error) {
                        custom.error(error.message, "");
                    }
                }
            }
        };

        if (interaction.isButton()) {
            try {
                const button = require(`../interactions/buttons/${interaction.customId}.js`);
                await button.execute(interaction, client);
            } catch (error) {
                custom.error(`${interaction.customId} が見つかりません\n${error.message}`, "");
                interaction.reply({ content: "Error", flags: [MessageFlags.Ephemeral] });
                return;
            }
        }

        if (interaction.isModalSubmit()) {
            try {
                const modal = require(`../interactions/modals/${interaction.customId}.js`);
                await modal.execute(interaction, client);
            } catch (error) {
                custom.error(`${interaction.customId} が見つかりません\n${error.message}`, "");
                interaction.reply({ content: "Error", flags: [MessageFlags.Ephemeral] });
                return;
            }
        }

        if (interaction.isStringSelectMenu()) {
            try {
                const selectmenu = require(`../interactions/selectmenus/${interaction.customId}.js`);
                await selectmenu.execute(interaction, client);
            } catch (error) {
                custom.error(`${interaction.customId} が見つかりません\n${error.message}`, "");
                interaction.reply({ content: "Error", flags: [MessageFlags.Ephemeral] });
                return;
            }
        }
    },
};