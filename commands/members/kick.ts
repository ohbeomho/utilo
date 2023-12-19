import { SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
    data: new SlashCommandBuilder().setName("kick").setDescription("멤버 추방"),
    async execute(interaction) {
        await interaction.reply({ content: "아직 개발중입니다.", ephemeral: true });
    }
};
