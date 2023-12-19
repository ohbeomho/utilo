import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "..";
import commandInfo from "../commandInfo.json";

export const command: Command = {
    data: new SlashCommandBuilder().setName("help").setDescription("명령어 목록 표시"),
    async execute(interaction) {
        const embeds = [];

        for (let category of commandInfo.categories) {
            embeds.push(
                new EmbedBuilder()
                    .setTitle(category.name + " commands")
                    .setDescription(
                        category.commands
                            .map(
                                (command) =>
                                    `**${command.name}** - ${command.description}${
                                        command.developing ? "_ - 개발중_" : ""
                                    }`
                            )
                            .join("\n")
                    )
            );
        }

        await interaction.reply({ embeds });
    }
};
