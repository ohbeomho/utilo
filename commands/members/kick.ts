import { SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
    data: new SlashCommandBuilder().setName("kick").setDescription("멤버 추방"),
    async execute(interaction) {}
};
