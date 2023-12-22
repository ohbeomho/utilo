import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
    // data: new SlashCommandBuilder().setName("help").setDescription("명령어 목록 표시"),
    data: "info",
    async execute(interaction) {
        await interaction.reply({ content: "개발중", ephemeral: true });
    }
};
