import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "..";
import { commandArr } from "../..";

export const command: Command = {
    data: new SlashCommandBuilder().setName("help").setDescription("명령어 목록 표시"),
    async execute(interaction) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder().setTitle("명령어 목록").setDescription(
                    commandArr
                        .map((command) => {
                            if (typeof command.data === "string") {
                                return `- **${command.data}** _(개발중)_`;
                            }

                            return `- **${command.data.name}**`;
                        })
                        .join("\n")
                )
            ]
        });
    }
};
