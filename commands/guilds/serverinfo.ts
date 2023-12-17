import { SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
    data: new SlashCommandBuilder().setName("server-info").setDescription("서버 정보"),
    async execute(interaction) {
        // TODO: get server informations like date created, member count, etc.
    }
};
