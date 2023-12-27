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
        .setName("add-user")
        .setDescription("사용자에게 역할을 추가합니다.")
        .addRoleOption((option) => option.setName("role").setDescription("사용자에게 추가할 역할").setRequired(true)),
    async execute(interaction) {
        const member = interaction.member! as GuildMember;
        const role = interaction.options.getRole("role")! as Role;

        const err = (content: string) => interaction.reply({ content, ephemeral: true });

        if (!member.permissions.has(PermissionFlagsBits.ManageRoles))
            await err("당신에게 역할을 관리할 권한이 없습니다.");
        else if (member.roles.highest.comparePositionTo(role) < 0)
            await err("추가하려는 역할이 당신의 역할보다 권한이 높습니다.");

        if (interaction.replied) return;

        const memberCount = (await interaction.guild!.members.fetch()).size;
        const userSelect = new UserSelectMenuBuilder()
            .setCustomId("role-add-user")
            .setMinValues(1)
            .setMaxValues(memberCount)
            .setPlaceholder("역할을 추가할 사용자");
        const addButton = new ButtonBuilder()
            .setCustomId("add")
            .setLabel("추가")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);
        const cancelButton = new ButtonBuilder().setCustomId("cancel").setLabel("취소").setStyle(ButtonStyle.Secondary);
        const selectRow = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(userSelect);
        const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(addButton, cancelButton);
        const components: any[] = [selectRow, buttonRow];

        const response = await interaction.reply({ components, ephemeral: true });
        let roleAddUsers: string[] = [];
        let disabled = true;
        const filter = (i: Interaction) => i.user.id === interaction.user.id;
        const stop = createCollector(response, filter, ComponentType.UserSelect, async (i) => {
            roleAddUsers = i.values;
            if (disabled) {
                addButton.setDisabled(false);
                disabled = false;
            }

            await i.update({ content: `${roleAddUsers.length}명 선택됨`, components });
        });
        awaitComponent(response, filter, async (i) => {
            stop();

            if (i.customId === "add") {
                const users = await interaction.guild!.members.fetch({ user: roleAddUsers });
                await Promise.all(users.map((user) => user.roles.add(role)));
                await i.update({
                    content: `${roleAddUsers.length}명에게 <@&${role.id}>역할을 추가했습니다.`,
                    components: []
                });
            } else if (i.customId === "cancel") {
                await i.update({ content: "역할 추가가 취소되었습니다.", components: [] });
            }
        });
    }
};

export default subcommand;
