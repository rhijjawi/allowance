import {Webhook} from "discord-webhook-node"
export default async function reportFail(pointInProcess : string, error?: string|null) : Promise<void> {
    const e = error ? error : "";
    const webhookURL = "https://discord.com/api/webhooks/1192491211978707075/XWxe6JIaipke7nC6oa1iZa2JDwilsBRbGnEiXImHpnQJhUPQXfrPNExK_WArAsm_BH0i";
    const webhook = new Webhook(webhookURL);
    webhook.setUsername("Report Generation Failed");
    webhook.setAvatar("https://em-content.zobj.net/source/apple/354/pensive-face_1f614.png");
    await webhook.send(`Error: ${e} `);
    return
}