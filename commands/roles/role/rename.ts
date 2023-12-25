import { GuildMember, PermissionFlagsBits, Role, SlashCommandSubcommandBuilder } from "discord.js";
import { Subcommand } from "../..";

const subcommand: Subcommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName("rename")
        .setDescription("역할 이름 변경")
        .addRoleOption((option) => option.setName("role").setDescription("이름을 변경할 역할").setRequired(true))
        .addStringOption((option) => option.setName("name").setDescription("역할의 새로운 이름").setRequired(true)),
    async execute(interaction) {
        const member = interaction.member! as GuildMember;
        const role = interaction.options.getRole("role")! as Role;

        const err = (content: string) => interaction.reply({ content, ephemeral: true });

        if (!member.permissions.has(PermissionFlagsBits.ManageRoles))
            await err("당신에게 역할을 관리할 권한이 없습니다.");
        else if (member.roles.highest.comparePositionTo(role) < 0)
            await err("색상을 변경하려는 역할이 당신의 역할보다 권한이 높습니다.");
        else if (!role.editable) await err("저에게 이 역할을 수정할 권한이 없습니다.");

        if (interaction.replied) return;

        const name = interaction.options.getString("name")!;
        const oldName = role.name;

        await role.setName(name);
        await interaction.reply(`역할 이름 변경됨: **${oldName}** -> <@&${role.id}>`);
    }
};

export default subcommand;
