import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "..";
import { VER } from "../../config";

export const command: Command = {
  data: new SlashCommandBuilder().setName("info").setDescription("봇 정보 표시"),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("UTILO")
          .setDescription("간단한 디스코드 봇\n[소스코드](https://github.com/OhBeomho/utilo)")
          .addFields({ name: "버전", value: VER }, { name: "개발자", value: "ohbeomho" })
      ]
    });
  }
};
