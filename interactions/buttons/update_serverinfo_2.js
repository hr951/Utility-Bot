const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require("discord.js");
const { serverModel } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        let ip_hub_2_je;
        let ip_hub_2_be;
        let port_hub_2_je;
        let port_hub_2_be;
        try {
            const server_config = await serverModel.findOne({ _id: "1265637138247057428" });
            ip_hub_2_je = server_config.ip_hub_2_je;
            port_hub_2_je = server_config.port_hub_2_je;
            ip_hub_2_be = server_config.ip_hub_2_be;
            port_hub_2_be = server_config.port_hub_2_be;
        } catch (error) {
            console.log(error);
        }

        const modal = new ModalBuilder()
            .setTitle("HUBサーバー ➁ 情報更新")
            .setCustomId("hub_2_submit");
        const TextInput_1 = new TextInputBuilder()
            .setLabel("HUBサーバー ➁ (JE)のIPアドレスを入力してください")
            .setCustomId("ip_hub_2_je")
            .setStyle("Short")
            .setValue(ip_hub_2_je || "undefined")
            .setMaxLength(100)
            .setMinLength(2)
            .setRequired(true);
        const TextInput_2 = new TextInputBuilder()
            .setLabel("HUBサーバー ➁ (JE)のポートを入力してください")
            .setCustomId("port_hub_2_je")
            .setStyle("Short")
            .setValue(`${port_hub_2_je}` || "undefined")
            .setMaxLength(1000)
            .setMinLength(2)
            .setRequired(true);
        const TextInput_3 = new TextInputBuilder()
            .setLabel("HUBサーバー ➁ (BE)のIPアドレスを入力してください")
            .setCustomId("ip_hub_2_be")
            .setStyle("Short")
            .setValue(ip_hub_2_be || "undefined")
            .setMaxLength(100)
            .setMinLength(2)
            .setRequired(true);
        const TextInput_4 = new TextInputBuilder()
            .setLabel("HUBサーバー ➁ (BE)のポートを入力してください")
            .setCustomId("port_hub_2_be")
            .setStyle("Short")
            .setValue(`${port_hub_2_be}` || "undefined")
            .setMaxLength(1000)
            .setMinLength(2)
            .setRequired(true);
        const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
        const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
        const ActionRow_3 = new ActionRowBuilder().setComponents(TextInput_3);
        const ActionRow_4 = new ActionRowBuilder().setComponents(TextInput_4);
        modal.setComponents(ActionRow, ActionRow_2, ActionRow_3, ActionRow_4);
        return interaction.showModal(modal);

    }
};