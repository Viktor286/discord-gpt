import * as https from "https";
import { OutgoingHttpHeaders } from "http";

interface RequestOptions extends https.RequestOptions {
    headers?: OutgoingHttpHeaders;
}

export default async function makeRequest(options: RequestOptions, data: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {

            let responseBody = "";
            res.on("data", (chunk) => {
                responseBody += chunk;
            });

            res.on("end", () => {
                console.log('Request responseBody', responseBody);
                resolve(responseBody);
            });
        });

        req.on("error", (error) => {
            console.error(error);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}
