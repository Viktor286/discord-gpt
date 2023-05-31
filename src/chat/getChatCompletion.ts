import makeChatPrompt, {IMessage} from "./makeChatPrompt";
import makeOpenaiRequestOptions from "./makeOpenaiRequestOptions";
import makeRequest from "./makeRequest";

export async function getChatCompletion(messages?: IMessage[]): Promise<string> {
    const data = JSON.stringify(makeChatPrompt(messages));
    // console.log('@@ data', data);
    const options = makeOpenaiRequestOptions(data);
    // console.log('@@ options', options);
    const res = await makeRequest(options, data);
    // console.log('@@ res', res);
    const chatJson = JSON.parse(res);
    return chatJson.choices[0].message.content;
}
