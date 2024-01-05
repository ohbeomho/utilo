import { SlashCommandSubcommandBuilder, GuildMember, PermissionFlagsBits, ColorResolvable } from "discord.js";
import { Subcommand } from "../..";

const subcommand: Subcommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName("create")
    .setDescription("역할을 생성합니다.")
    .addStringOption((option) => option.setName("name").setDescription("새로운 역할의 이름").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("새로운 역할의 색상 (6자리 hex color(rrggbb)만 됩니다. 예시: 빨강 = ff0000)")
    ),
  async execute(interaction) {
    const member = interaction.member! as GuildMember;

    if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await interaction.reply({
        content: "당신에게 역할을 관리할 권한이 없습니다.",
        ephemeral: true
      });
      return;
    }

    const guild = interaction.guild!;
    const name = interaction.options.getString("name")!;
    const color = interaction.options.getString("color");

    const role = await guild.roles.create({
      name,
      color: color ? (("#" + color) as ColorResolvable) : undefined
    });
    await interaction.reply(`역할이 생성되었습니다: <@&${role.id}>`);
  }
};

export default subcommand;
