import {Client, Events, GatewayIntentBits, Partials} from "discord.js";
import {config} from "../config";
import {onMessageCreate} from "../discord/onMessageCreate";
import {onMessageReaction} from "../discord/onMessageReaction";
// import {deployCommands} from "./deploy-commands";
// import {commands} from "./commands";

export const initDiscordClient = () => {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
        partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });

    client.once("ready", async () => {
        // await deployCommands({guildId: '1108066646578430022'});
        console.log("Discord bot is ready! 🤖");
    });

    client.on("guildCreate", async (guild) => {
        // await deployCommands({guildId: guild.id});
    });

    client.on(Events.MessageCreate, onMessageCreate(client));
    client.on(Events.MessageCreate, (client) => {
        //
    });

    client.on(Events.MessageReactionAdd,  onMessageReaction);

    client.login(config.DISCORD_TOKEN);

    return client;
}


