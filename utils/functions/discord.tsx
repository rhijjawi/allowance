import axios from "axios";

export default async function reportFail(pointInProcess: string, error?: string | null): Promise<void> {
    const e = error ? error : "";
    const webhookURL = "https://discord.com/api/webhooks/1192491211978707075/XWxe6JIaipke7nC6oa1iZa2JDwilsBRbGnEiXImHpnQJhUPQXfrPNExK_WArAsm_BH0i";
    
    try {
        await axios.post(webhookURL, {
            username: "Report Generation Failed",
            avatar_url: "https://em-content.zobj.net/source/apple/354/pensive-face_1f614.png",
            content: `Error: ${e}`,
        });
    } catch (error) {
        console.error("Failed to send Discord webhook:", error);
    }
}
