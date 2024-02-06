import { Webhook } from "discord-webhook-node";
import axios from "axios";
async function main() {
  const webhook = new Webhook("https://discord.com/api/webhooks/.../...");
  webhook.setUsername("Successfull Build (CI)");
  webhook.setAvatar("https://logmoney.app/favicon.ico");
  webhook.send(":smile: Build Successfull! ");
}
main();
