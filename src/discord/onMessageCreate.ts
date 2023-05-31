import {Client, Message, PartialMessage} from "discord.js";
import {getChatCompletion} from "../chat/getChatCompletion";
import {multiMessageSend} from "../utils";

export const onMessageCreate = (client: Client) => async (message: Message | PartialMessage) => {
    if (message.content && message.content.startsWith('!')) {
        await message.react('⏳'); // indicate that the message started processing

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
                    const generatedResponse = await getChatCompletion([{
                        role: 'user',
                        content: message.content.slice(1)
                    }])
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
}
