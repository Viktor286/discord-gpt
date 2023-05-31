import {Client, Events, GatewayIntentBits, Partials} from "discord.js";
import {config} from "./config";
import {getChatCompletion} from "./chat/getChatCompletion";
import {multiMessageSend} from "./utils";
// import {deployCommands} from "./deploy-commands";
// import {commands} from "./commands";

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

// client.on("interactionCreate", async (interaction) => {
// });

client.on(Events.MessageCreate, async (message) => {
    if (message.content.startsWith('!')) {
        message.react('⏳'); // indicate that the message started processing

        try {
            if (message.channelId) {
                const channel = client.channels.cache.get(message.channelId);

                // Start new thread
                // https://old.discordjs.dev/#/docs/discord.js/14.11.0/class/ThreadChannel?scrollTo=ownerId
                if (channel && !channel.isThread()) {
                    const currentMessage = await channel.messages.fetch(channel.lastMessageId);
                    const thread = await channel.threads.create({
                        name: message.content.slice(0, 20),
                        autoArchiveDuration: 60,
                        startMessage: currentMessage
                    });
                    const currentThreadChannel = await thread.fetch();
                    const generatedResponse = await getChatCompletion([{role:'user', content: message.content.slice(1)}])
                    await multiMessageSend(currentThreadChannel, generatedResponse);
                    message.reactions.removeAll();
                    return;
                }

                // Continue existed thread
                if (channel && channel.isThread()) {
                    // Remember the chat
                    const threadMessages = await channel.messages.fetch({limit: 20, cache: true});

                    // Adjust the chat structure
                    const chat = threadMessages.map(({author: {username}, content}) => {
                        return {
                            role: username === 'lmm-gpt' ? 'assistant' : 'user',
                            content: username === 'lmm-gpt' ? content.replace('’', "'") : content.slice(1).replace('’', "'")
                        }
                    }).reverse();

                    // Adjust starter message
                    const initMessage = await channel.fetchStarterMessage();
                    chat[0] = {
                        role: 'user',
                        content: initMessage.content.slice(1)
                    }

                    // Response with generated with memory
                    const generatedResponse = await getChatCompletion(chat)
                    await multiMessageSend(channel, generatedResponse);

                    message.reactions.removeAll();
                    return;
                }
            }
        } catch (e) {
            message.reactions.removeAll();
            message.react('🚧');
            console.error('Bot message thrown an error', e);
            return;
        }
    }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    // console.log('@@ reaction', reaction);
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    // // Now the message has been cached and is fully available
    // console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
    // // The reaction is now also fully available and the properties will be reflected accurately:
    // console.log(`${reaction.count} user(s) have given the same reaction to this message!`);

    // Delete message on 🗑 emoji
    if (reaction._emoji.name.includes('🗑')) reaction.message.delete();
});

client.login(config.DISCORD_TOKEN);
