import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { Command, loadCommands } from "./commands";
import { NODE_ENV, BOT_TOKEN, APP_ID } from "./config";
import path from "path";

export let commandArr: Command[];

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
const commands = new Collection<string, Command>();

client.once(Events.ClientReady, () => console.log(`${client.user?.tag}으로 로그인됨`));
client.on(Events.InteractionCreate, async (interaction) => {
    if (
        !interaction.isChatInputCommand() ||
        (NODE_ENV === "prod" && interaction.commandName.endsWith("-test")) ||
        (NODE_ENV === "dev" && !interaction.commandName.endsWith("-test"))
    )
        return;

    const command = commands.get(interaction.commandName);
    if (!command) {
        console.error(`'${interaction.commandName}' - 존재하지 않는 명령입니다.`);
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
    commandArr = await loadCommands(path.join(__dirname, "commands"));
    commandArr.forEach((command) => {
        if (typeof command.data !== "string") {
            if (NODE_ENV === "dev") command.data.setName(command.data.name + "-test");
            commands.set(command.data.name, command);
        }
    });

    const rest = new REST().setToken(BOT_TOKEN);
    const body = commandArr
        .filter((command) => typeof command.data !== "string")
        .map((command) => command.data.toJSON());

    try {
        if (NODE_ENV === "prod") {
            await rest.put(Routes.applicationCommands(APP_ID), { body });
            console.log("명령어 등록됨");
        } else if (NODE_ENV === "dev") {
            const GUILD_ID = process.env.GUILD_ID;
            if (!GUILD_ID) {
                console.error("NODE_ENV가 'dev'이므로 GUILD_ID가 .env에 정의되어 있어야 합니다.");
                process.exit(1);
            }

            await rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), { body });
            console.log("테스트용 명령어 등록됨");
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    client.login(BOT_TOKEN);
})();
