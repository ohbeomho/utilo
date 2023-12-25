import { SlashCommandBuilder } from "discord.js";
import { Command, Subcommand } from "../..";
import create from "./create";
import del from "./delete";
import addUser from "./addUser";
import removeUser from "./removeUser";
import list from "./list";
import color from "./color";
import rename from "./rename";

const subcommandArr: Subcommand[] = [create, del, addUser, removeUser, list, color, rename];
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
