import "dotenv/config";
import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { Command } from "./commands";
import fs from "fs/promises";

const BOT_TOKEN = process.env.BOT_TOKEN,
    APP_ID = process.env.APP_ID;

if (!BOT_TOKEN || !APP_ID) {
    console.error("BOT_TOKEN, APP_ID가 .env 파일에 정의되어 있어야 합니다.");
    process.exit(1);
}

async function loadCommands(): Promise<Command[]> {
    return (
        await Promise.all(
            (await fs.readdir("./commands", { recursive: true, withFileTypes: true }))
                .filter(
                    (dirent) => dirent.isFile() && !dirent.name.startsWith("index") && !dirent.name.endsWith(".json")
                )
                .map((commandFile) => import(`./${commandFile.path}/${commandFile.name}`))
        )
    )
        .filter((imported) => imported.command)
        .map((imported) => imported.command);
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

client.once(Events.ClientReady, () => console.log(`${client.user?.tag}으로 로그인됨`));
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) {
        console.error(`'${interaction.commandName}'은 존재하지 않는 명령입니다.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        const message = { content: "명령을 실행하던 중 오류가 발생하였습니다.", ephemeral: true };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(message);
        } else {
            await interaction.reply(message);
        }
    }
});

(async () => {
    const commandArr = await loadCommands();
    console.log("Loaded commands:");
    let commandString = "";
    commandArr.forEach((command) => {
        commands.set(command.data.name, command);
        commandString += command.data.name + " ";
    });
    console.log(commandString.trim().replaceAll(" ", ", "));

    const rest = new REST().setToken(BOT_TOKEN);

    try {
        await rest.put(Routes.applicationCommands(APP_ID), {
            body: commandArr.map((command) => command.data.toJSON())
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    client.login(BOT_TOKEN);
})();
