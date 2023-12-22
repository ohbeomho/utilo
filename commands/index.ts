import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

export type CommandData = SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;

export interface Command {
    data: CommandData | string;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface Subcommand {
    data: SlashCommandSubcommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
