import { EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Subcommand } from "../..";

const subcommand: Subcommand = {
  data: new SlashCommandSubcommandBuilder().setName("list").setDescription("서버의 역할 목록을 표시합니다."),
  async execute(interaction) {
    const guild = interaction.guild!;
    const roles = (await guild.roles.fetch()).filter((role) => role.id !== guild.roles.everyone.id);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(guild.name + " 역할 목록")
          .setDescription(roles.map((role) => `<@&${role.id}>`).join("\n"))
      ]
    });
  }
};

export default subcommand;
