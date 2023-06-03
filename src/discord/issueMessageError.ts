import {Message, PartialMessage} from "discord.js";

export const issueMessageError = (message: Message | PartialMessage, label: string, e: Error) => {
    message.reactions.removeAll();
    message.react('🚧');
    console.error(`Bot message thrown an error | ${label}`, e);
}
