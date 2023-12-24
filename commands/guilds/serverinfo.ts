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
            .setAuthor({ name: guildOwner.user.tag, iconURL: guildOwner.user.avatarURL() || undefined })
            .setDescription(guild.description)
            .addFields(
                { name: "Created at", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>` },
                { name: "Member count", value: String(guild.memberCount) },
                { name: "Role count", value: String((await guild.roles.fetch()).size - 1), inline: true },
                {
                    name: "Channel count",
                    value: String(
                        (await guild.channels.fetch()).filter((channel) => !(channel instanceof CategoryChannel)).size
                    ),
                    inline: true
                }
            )
            .setThumbnail(guild.iconURL());
        await interaction.reply({ embeds: [embed] });
    }
};
