import { SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
  data: new SlashCommandBuilder().setName("ping").setDescription("pong 으로 답장"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  }
};
