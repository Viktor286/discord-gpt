import makeChatPrompt, {IMessage} from "./makeChatPrompt";
import makeOpenaiRequestOptions from "./makeOpenaiRequestOptions";
import makeRequest from "./makeRequest";

export async function getChatCompletion(messages?: IMessage[]): Promise<string> {
    console.log(`Getting Chat Completion for ${messages?.length} messages`);
    const data = JSON.stringify(makeChatPrompt(messages));
    const options = makeOpenaiRequestOptions(data);
    const res = await makeRequest(options, data);
    const chatJson = JSON.parse(res);
    if(chatJson.error) throw new Error(chatJson.error)
    console.log(`Completions obtained!`);
    return chatJson.choices[0].message.content;
}
