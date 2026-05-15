import "dotenv/config";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

import { JsonMemberRepository } from "../storage/JsonMemberRepository";
import { GerenciadorFilaUseCase } from "../../use-cases/GerenciadorFilaUseCase";
import { WhatsAppController } from "../../adapters/controllers/WhatsAppController";

console.log("Montando a Arquitetura do WaterBot DTIC...");

const repository = new JsonMemberRepository();
const useCase = new GerenciadorFilaUseCase(repository);
const controller = new WhatsAppController(useCase);

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./sessions" }),
  puppeteer: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
});

const ALLOWED_GROUP_ID = process.env.ALLOWED_GROUP_ID;

client.on("qr", (qr) => qrcode.generate(qr, { small: true }));

client.on("ready", () => {
  console.log("✅ WaterBot DTIC está Online e Protegido!");
  if (!ALLOWED_GROUP_ID) {
    console.log(
      "⚠️ AVISO: O bot está operando em MODO ABERTO (ALLOWED_GROUP_ID não definido no .env).",
    );
  }
});

client.on("message_create", async (msg) => {
  if (ALLOWED_GROUP_ID) {
    const isFromAllowedGroup =
      msg.from === ALLOWED_GROUP_ID || msg.to === ALLOWED_GROUP_ID;
    if (!isFromAllowedGroup) {
      return;
    }
  }
  if (msg.body === "!meuid") {
    console.log(
      `\n🔑 ID DESTE CHAT: ${msg.from}\nCole este valor no seu arquivo .env!\n`,
    );
    await msg.reply(
      `O ID deste grupo é: ${msg.from}\n(Copie no terminal para o arquivo .env)`,
    );
    return;
  }
  if (msg.body.startsWith("!")) {
    await controller.handle(msg);
  }
});

client.initialize();
