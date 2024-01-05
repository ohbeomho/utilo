import {
  SlashCommandSubcommandBuilder,
  GuildMember,
  Role,
  PermissionFlagsBits,
  UserSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Interaction,
  ComponentType
} from "discord.js";
import { Subcommand } from "../..";
import { createCollector } from "../../../utils/interaction/select";
import { awaitComponent } from "../../../utils/interaction/button";

const subcommand: Subcommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName("remove-user")
    .setDescription("사용자에게서 역할을 제거합니다.")
    .addRoleOption((option) => option.setName("role").setDescription("사용자에게서 제거할 역할").setRequired(true)),
  async execute(interaction) {
    const member = interaction.member! as GuildMember;
    const role = interaction.options.getRole("role")! as Role;

    const err = (content: string) => interaction.reply({ content, ephemeral: true });

    if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) err("당신에게 역할을 관리할 권한이 없습니다.");
    else if (member.roles.highest.comparePositionTo(role) < 0)
      err("제거하려는 역할이 당신의 역할보다 권한이 높습니다.");
    else if (!role.editable) err("저에게 역할을 관리할 권한이 없습니다.");

    if (interaction.replied) return;

    const memberCount = (await interaction.guild!.members.fetch()).size;
    const userSelect = new UserSelectMenuBuilder()
      .setCustomId("role-remove-user")
      .setMinValues(1)
      .setMaxValues(memberCount)
      .setPlaceholder("역할을 삭제할 사용자");
    const removeButton = new ButtonBuilder()
      .setCustomId("remove")
      .setLabel("제거")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true);
    const cancelButton = new ButtonBuilder().setCustomId("cancel").setLabel("취소").setStyle(ButtonStyle.Secondary);
    const selectRow = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(userSelect);
    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(removeButton, cancelButton);
    const components: any[] = [selectRow, buttonRow];

    const response = await interaction.reply({ components, ephemeral: true });
    let roleRemoveUsers: string[] = [];
    let disabled = true;
    const filter = (i: Interaction) => i.user.id === interaction.user.id;
    const stop = createCollector(response, filter, ComponentType.UserSelect, async (i) => {
      roleRemoveUsers = i.values;
      if (disabled) {
        removeButton.setDisabled(false);
        disabled = false;
      }

      await i.update({
        content: `${roleRemoveUsers.length}명 선택됨`,
        components
      });
    });
    awaitComponent(response, filter, async (i) => {
      stop();

      if (i.customId === "remove") {
        const users = await interaction.guild!.members.fetch({
          user: roleRemoveUsers
        });
        await Promise.all(users.map((user) => user.roles.remove(role)));
        await i.update({
          content: `${roleRemoveUsers.length}명에게서 <@&${role.id}>역할을 제거했습니다.`,
          components: []
        });
      } else if (i.customId === "cancel") {
        await i.update({
          content: "역할 삭제가 취소되었습니다.",
          components: []
        });
      }
    });
  }
};

export default subcommand;
