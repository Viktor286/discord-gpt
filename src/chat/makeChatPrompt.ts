export interface IMessage {
    role: string;
    content: string;
}

interface ISettings {
    max_tokens?: number;
    temperature?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    top_p?: number;
    stop?: null;
}

export default function makeChatPrompt(messages?: IMessage[], settings: ISettings = {}) {
    const defaultMessages = [
        { role: "system", content: "You are an AI assistant that helps people find information." },
        { role: "user", content: "marco!" },
    ];

    if (messages && messages.length > 0) {
        messages = messages.map((msg) => {
            msg.content = encodeURIComponent(msg.content)
            return msg;
        })
    }

    return {
        messages: messages || defaultMessages,
        model: "gpt-4",
        max_tokens: 1800,
        temperature: 0.7,
        frequency_penalty: 0.1,
        presence_penalty: 0.3,
        top_p: 0.95,
        stop: null,
        ...settings
    }
}
