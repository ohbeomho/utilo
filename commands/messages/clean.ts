import { SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("clean")
        .setDescription("메시지 삭제")
        .addIntegerOption((option) => option.setName("count").setDescription("삭제할 메시지 개수").setRequired(true)),
    async execute(interaction) {
        if (!interaction.inGuild()) return;

        const count = interaction.options.getInteger("count")!;
        const channel = interaction.channel!;

        const deletedCount = (await channel.bulkDelete(count, true)).size;
        let content = `메시지 ${count - (count - deletedCount)}개가 삭제되었습니다.`;
        if (count !== deletedCount) {
            content += ` _(${count - deletedCount}개는 오래되어 삭제할 수 없습니다.)_`;
        }

        await interaction.reply({ content, ephemeral: true });
    }
};
