import { SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
    data: new SlashCommandBuilder().setName("ban").setDescription("멤버 밴"),
    async execute(interaction) {}
};
