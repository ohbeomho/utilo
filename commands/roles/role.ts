import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ColorResolvable,
    ComponentType,
    RoleSelectMenuBuilder,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder
} from "discord.js";
import { Command } from "..";

interface Subcommand {
    data: SlashCommandSubcommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const subcommandArr: Subcommand[] = [
    {
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
            const guild = interaction.guild!;
            const name = interaction.options.getString("name")!;
            const color = interaction.options.getString("color");

            const role = await guild.roles.create({
                name,
                color: color ? (("#" + color) as ColorResolvable) : undefined
            });
            await interaction.reply(`역할이 생성되었습니다: <@&${role.id}>`);
        }
    },
    {
        data: new SlashCommandSubcommandBuilder().setName("delete").setDescription("역할을 삭제합니다."),
        async execute(interaction) {
            const roleCount = (await interaction.guild!.roles.fetch()).size - 1;
            const roleSelect = new RoleSelectMenuBuilder()
                .setCustomId("role-delete")
                .setMinValues(1)
                .setMaxValues(roleCount)
                .setPlaceholder("삭제할 역할을 고르세요.");
            const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(roleSelect);

            const response = await interaction.reply({ components: [row], ephemeral: true });
            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.RoleSelect,
                time: 600_000
            });
            let deleteRoles: string[] = [];
            collector.on("collect", async (collected) => {
                for (let role of collected.values) {
                    deleteRoles.push(role);
                    console.log(deleteRoles);
                }
            });

            // TODO: 삭제 확인 (버튼 사용)
        }
    },
    {
        data: new SlashCommandSubcommandBuilder()
            .setName("add-user")
            .setDescription("사용자에게 역할을 추가합니다.")
            .addUserOption((option) => option.setName("user").setDescription("역할을 추가할 사용자").setRequired(true))
            .addRoleOption((option) =>
                option.setName("role").setDescription("사용자에게 추가할 역할").setRequired(true)
            ),
        async execute(interaction) {}
    },
    {
        data: new SlashCommandSubcommandBuilder()
            .setName("remove-user")
            .setDescription("사용자에게서 역할을 제거합니다.")
            .addUserOption((option) => option.setName("user").setDescription("역할을 제거할 사용자").setRequired(true))
            .addRoleOption((option) =>
                option.setName("role").setDescription("사용자에게서 제거할 역할").setRequired(true)
            ),
        async execute(interaction) {}
    }
];

const subcommands = new Map<string, Subcommand>();
const data = new SlashCommandBuilder().setName("role").setDescription("역할 관련");
for (let subcommand of subcommandArr) {
    subcommands.set(subcommand.data.name, subcommand);
    data.addSubcommand(subcommand.data);
}

export const command: Command = {
    data,
    async execute(interaction) {
        if (!interaction.inGuild()) return;

        const subcommand = interaction.options.getSubcommand(true);
        await subcommands.get(subcommand)!.execute(interaction);
    }
};
