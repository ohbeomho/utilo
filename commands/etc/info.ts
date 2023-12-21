import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "..";
import commandInfo from "../commandInfo.json";

export const command: Command = {
    data: new SlashCommandBuilder().setName("help").setDescription("명령어 목록 표시"),
    async execute(interaction) {
        await interaction.reply({ content: "개발중", ephemeral: true });
    }
};
