import { SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
    // data: new SlashCommandBuilder().setName("clean").setDescription("메시지 삭제"),
    data: "clean",
    async execute(interaction) {
        // TODO: Remove messages ('remove_count' integer option)
    }
};
