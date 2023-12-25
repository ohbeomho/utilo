import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import path from "path";
import fs from "fs/promises";

export interface Command {
    data: any;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export async function loadCommands(commandsPath: string): Promise<Command[]> {
    return (
        await Promise.all(
            (await fs.readdir(commandsPath, { recursive: true, withFileTypes: true }))
                .filter((dirent) => dirent.isFile())
                .map((commandFile) => import(path.join(commandFile.path, commandFile.name)))
        )
    )
        .filter((imported) => imported.command)
        .map((imported) => imported.command);
}
