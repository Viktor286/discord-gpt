import * as dotenv from 'dotenv';
dotenv.config();

export default function makeOpenaiRequestOptions(data: string) {
    return {
        hostname: "api.openai.com",
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length,
            "authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
    }
};
