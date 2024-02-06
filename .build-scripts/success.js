import { Webhook } from "discord-webhook-node";
import axios from "axios";
async function main() {
  const webhook = new Webhook("https://discord.com/api/webhooks/1201684335732998164/ZyKGmOxj4h82vmU3jxXHvdzOvIUz0z2rXt5tuBbEpGpcNVIq7EKYb8gnhsOJkq-H4eMM");
  webhook.setUsername("Successfull Build (CI)");
  webhook.setAvatar("https://logmoney.app/favicon.ico");
  webhook.send(":smile: Build Successfull! ");
}
main();
