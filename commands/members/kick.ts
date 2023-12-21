import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("멤버 추방")
        .addUserOption((option) => option.setName("user").setDescription("추방시킬 사용자").setRequired(true))
        .addStringOption((option) => option.setName("reason").setDescription("추방 사유")),
    async execute(interaction) {
        if (!interaction.inGuild()) return;

        const err = (content: string) => interaction.reply({ content, ephemeral: true });

        const user = interaction.member as GuildMember;
        if (!user.permissions.has(PermissionFlagsBits.KickMembers)) {
            await err("당신에게 사용자를 추방할 권한이 없습니다.");
            return;
        }

        const target = interaction.options.getMember("user")! as GuildMember;
        if (user.roles.highest.comparePositionTo(target.roles.highest) < 0) {
            await err(`${target.user.tag}님이 당신보다 권한이 높아 추방할 수 없습니다.`);
            return;
        } else if (!target.kickable) {
            await err(`저에게 ${target.user.tag}님을 추방할 권한이 없습니다.`);
            return;
        }

        await target.kick(interaction.options.getString("reason") || undefined);
        await interaction.reply(`${target.user.tag}님이 추방되었습니다.`);
    }
};
