import {AnyThreadChannel} from "discord.js";

export function splitTextInChunks(text: string, chunkSize: number) {
    const chunks = [];

    let startIndex = 0;
    while (startIndex < text.length) {
        let endIndex = startIndex + chunkSize;

        while (text[endIndex] && text[endIndex] !== ' ' && text[endIndex] !== '\n' && endIndex > startIndex) {
            endIndex--;
        }

        if (endIndex === startIndex) { // If no whitespace is found in chunk
            endIndex = startIndex + chunkSize;
        }

        const chunk = text.slice(startIndex, endIndex);
        chunks.push(chunk);
        startIndex = endIndex + 1;
    }

    return chunks;
}

export async function multiMessageSend(channel: AnyThreadChannel, longMessage: string) {
    const chunks = splitTextInChunks(longMessage, 1900);
    for (let i = 0; i < chunks.length; i++) {
        await channel.send(`'''${chunks[i]}`);
    }
}
