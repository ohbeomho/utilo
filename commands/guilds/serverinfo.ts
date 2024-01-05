import { SlashCommandBuilder, EmbedBuilder, CategoryChannel } from "discord.js";
import { Command } from "..";

export const command: Command = {
  data: new SlashCommandBuilder().setName("server-info").setDescription("서버 정보"),
  async execute(interaction) {
    if (!interaction.inGuild()) return;
    const guild = interaction.guild!;

    const guildOwner = await guild.fetchOwner();
    const embed = new EmbedBuilder()
      .setTitle(guild.name)
      .setAuthor({
        name: guildOwner.user.tag,
        iconURL: guildOwner.user.avatarURL() || undefined
      })
      .setDescription(guild.description)
      .addFields(
        {
          name: "서버 생성 일시",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`
        },
        { name: "멤버 수", value: String(guild.memberCount) },
        {
          name: "역할 개수",
          value: String((await guild.roles.fetch()).size - 1),
          inline: true
        },
        {
          name: "채널 개수",
          value: String((await guild.channels.fetch()).filter((channel) => !(channel instanceof CategoryChannel)).size),
          inline: true
        }
      )
      .setThumbnail(guild.iconURL());
    await interaction.reply({ embeds: [embed] });
  }
};
