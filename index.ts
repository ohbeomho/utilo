import "dotenv/config";
import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { Command } from "./commands";
import commandInfo from "./commands/commandInfo.json";
import fs from "fs/promises";

const requiredVars = ["BOT_TOKEN", "APP_ID", "NODE_ENV"];
const env = requiredVars.map((name) => ({ name, value: process.env[name] }));
const undef = env.filter((e) => e.value === undefined);

if (undef.length) {
    console.log(`${undef.map((e) => e.name).join(", ")} is not defined in .env file`);
    process.exit(1);
}

const [BOT_TOKEN, APP_ID, NODE_ENV] = env.map((e) => e.value!);

async function loadCommands(): Promise<Command[]> {
    return (
        await Promise.all(
            (await fs.readdir("./commands", { recursive: true, withFileTypes: true }))
                .filter((dirent) => dirent.isFile())
                .map((commandFile) => import(`./${commandFile.path}/${commandFile.name}`))
        )
    )
        .filter((imported) => imported.command)
        .map((imported) => {
            const command: Command = imported.command;

            if (NODE_ENV === "dev") {
                command.data.setName(command.data.name + "-test");
            }

            return command;
        });
}

const commands = new Collection<string, Command>();

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, () => console.log(`Logged in with ${client.user?.tag}`));
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    else if (NODE_ENV === "dev" && interaction.commandName.endsWith("-test")) return;

    const command = commands.get(interaction.commandName);
    if (!command) {
        console.error(`Command '${interaction.commandName}' does not exists.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        const message = { content: "An error occurred while executing command.", ephemeral: true };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(message);
        } else {
            await interaction.reply(message);
        }
    }
});

(async () => {
    const commandArr = await loadCommands();
    commandArr.forEach((command) => commands.set(command.data.name, command));

    console.log(
        commandInfo.categories
            .map(
                (category) =>
                    category.name +
                    " commands:\n" +
                    category.commands
                        .map((command) => command.name + (command.developing ? " (developing)" : ""))
                        .join(", ")
            )
            .join("\n\n") + "\n"
    );

    const rest = new REST().setToken(BOT_TOKEN);
    const body = commandArr.map((command) => command.data.toJSON());

    try {
        if (NODE_ENV === "prod") {
            await rest.put(Routes.applicationCommands(APP_ID), { body });
        } else if (NODE_ENV === "dev") {
            const GUILD_ID = process.env.GUILD_ID;
            if (!GUILD_ID) {
                console.log("GUILD_ID should be defined in .env file if NODE_ENV is 'dev'");
                process.exit(1);
            }

            await rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), { body });
        }

        console.log("Registered commands");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    client.login(BOT_TOKEN);
})();
