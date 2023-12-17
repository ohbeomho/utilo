import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

export type Command = {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export type Subcommand = {
    data: SlashCommandSubcommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};
