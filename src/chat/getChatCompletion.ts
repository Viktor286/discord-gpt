import makeChatPrompt, {IMessage} from "./makeChatPrompt";
import makeOpenaiRequestOptions from "./makeOpenaiRequestOptions";
import makeRequest from "./makeRequest";

export async function getChatCompletion(messages?: IMessage[]): Promise<string> {
    const data = JSON.stringify(makeChatPrompt(messages));
    const options = makeOpenaiRequestOptions(data);
    const res = await makeRequest(options, data);
    const chatJson = JSON.parse(res);
    return chatJson.choices[0].message.content;
}
