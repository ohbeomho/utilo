import { SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
    data: new SlashCommandBuilder().setName("role").setDescription("역할 관련"),
    async execute(interaction) {}
};
