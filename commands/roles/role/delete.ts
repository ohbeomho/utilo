import {
    SlashCommandSubcommandBuilder,
    GuildMember,
    PermissionFlagsBits,
    RoleSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    Interaction,
    ComponentType
} from "discord.js";
import { Subcommand } from "../..";

const subcommand: Subcommand = {
    data: new SlashCommandSubcommandBuilder().setName("delete").setDescription("역할을 삭제합니다."),
    async execute(interaction) {
        const member = interaction.member! as GuildMember;

        if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            await interaction.reply({
                content: "당신에게 역할을 관리할 권한이 없습니다.",
                ephemeral: true
            });
            return;
        }

        const roleCount = (await interaction.guild!.roles.fetch()).size - 1;
        const roleSelect = new RoleSelectMenuBuilder()
            .setCustomId("role-delete")
            .setMinValues(1)
            .setMaxValues(roleCount)
            .setPlaceholder("삭제할 역할");
        const deleteButton = new ButtonBuilder()
            .setCustomId("delete")
            .setLabel("삭제")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);
        const cancelButton = new ButtonBuilder().setCustomId("cancel").setLabel("취소").setStyle(ButtonStyle.Secondary);
        const selectRow = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(roleSelect);
        const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(deleteButton, cancelButton);
        const components: any[] = [selectRow, buttonRow];

        const response = await interaction.reply({ components, ephemeral: true });
        let deleteRoles: string[] = [];
        let disabled = true;
        const filter = (i: Interaction) => i.user.id === interaction.user.id;

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.RoleSelect,
            filter,
            time: 120_000
        });
        collector.on("collect", async (collected) => {
            deleteRoles = collected.values;

            const higher = deleteRoles.filter((roleId) => member.roles.highest.comparePositionTo(roleId) < 0);
            if (higher.length) {
                if (!disabled) {
                    deleteButton.setDisabled(true);
                    disabled = true;
                }

                await collected.update({
                    content: `당신의 역할보다 더 높은 권한을 가진 역할을 제거할 수 없습니다. (${higher
                        .map((roleId) => `<@&${roleId}>`)
                        .join(" ")})`,
                    components
                });
                return;
            }

            if (disabled) {
                deleteButton.setDisabled(false);
                disabled = false;
            }

            await collected.update({ content: `${deleteRoles.length}개 역할 선택됨`, components });
        });

        const confirmation = await response.awaitMessageComponent({
            componentType: ComponentType.Button,
            filter,
            time: 120_000
        });

        if (confirmation.customId === "delete") {
            await Promise.all(deleteRoles.map((roleId) => interaction.guild!.roles.delete(roleId)));
            await confirmation.update({
                content: `${deleteRoles.length}개의 역할이 삭제되었습니다.`,
                components: []
            });
        } else if (confirmation.customId === "cancel") {
            await confirmation.update({ content: "역할 삭제가 취소되었습니다.", components: [] });
        }

        collector.stop();
    }
};

export default subcommand;
