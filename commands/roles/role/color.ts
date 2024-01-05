import { ColorResolvable, GuildMember, PermissionFlagsBits, Role, SlashCommandSubcommandBuilder } from "discord.js";
import { Subcommand } from "../..";

const subcommand: Subcommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName("color")
    .setDescription("역할 색상 변경")
    .addRoleOption((option) => option.setName("role").setDescription("색상을 변경할 역할").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("새로운 역할의 색상 (6자리 hex color(rrggbb)만 됩니다. 예시: 빨강 = ff0000)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.member! as GuildMember;
    const role = interaction.options.getRole("role")! as Role;

    const err = (content: string) => interaction.reply({ content, ephemeral: true });

    if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) await err("당신에게 역할을 관리할 권한이 없습니다.");
    else if (member.roles.highest.comparePositionTo(role) < 0)
      await err("색상을 변경하려는 역할이 당신의 역할보다 권한이 높습니다.");
    else if (!role.editable) await err("저에게 이 역할을 수정할 권한이 없습니다.");

    if (interaction.replied) return;

    const color = interaction.options.getString("color")!;
    const oldColor = role.hexColor.substring(1);
    await role.setColor(("#" + color) as ColorResolvable);
    await interaction.reply(`<@&${role.id}> 역할 색상이 변경되었습니다: **${oldColor} -> ${color}**`);
  }
};

export default subcommand;
