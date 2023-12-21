import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

export type Command = {
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export type Subcommand = {
    data: SlashCommandSubcommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};
