import { Webhook } from "discord-webhook-node";
import axios from "axios";
async function main() {
  const ghToken = process.env.GH_TOKEN;
  const r = axios.get(
    "https://api.github.com/repos/rhijjawi/allowance/commits",
    {
      headers: {
        Authorization: `Bearer ${ghToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  console.log((await r).data);
  const webhook = new Webhook("https://discord.com/api/webhooks/.../...");
  webhook.setUsername("Successfull Build (CI)");
  webhook.setAvatar("https://logmoney.app/favicon.ico");
  //smiling emoji
  webhook.send(":smile: Build Successfull! ");
}
main();
