import { Message } from "whatsapp-web.js";
import { GerenciadorFilaUseCase } from "../../use-cases/GerenciadorFilaUseCase";

export class WhatsAppController {
  constructor(private useCase: GerenciadorFilaUseCase) {}

  public async handle(msg: Message): Promise<void> {
    const args = msg.body.trim().split(/\s+/);
    const comando = args[0].toLowerCase();

    try {
      switch (comando) {
        case "!fila": {
          const lista = await this.useCase.obterFila();
          let texto = "*💧 Fila da Água DTIC*\n\n";
          lista.forEach(
            (m, i) =>
              (texto += `${i + 1}. ${m.getNome()} [${m.getSaldo()}X]\n`),
          );
          await msg.reply(texto);
          break;
        }
        case "!adicionar": {
          if (args.length < 2) {
            await msg.reply(
              "❌ Use: !adicionar [nome] ou !adicionar [nº] [nome]",
            );
            return;
          }
          if (isNaN(Number(args[1]))) {
            const nome = args.slice(1).join(" ");
            const novo = await this.useCase.adicionarPessoa(nome);
            await msg.reply(`✅ *${novo.getNome()}* adicionado à lista.`);
          } else {
            const qtd = parseInt(args[1]);
            const nome = args.slice(2).join(" ");
            const alvo = await this.useCase.adicionarGaloes(nome, qtd);
            await msg.reply(
              `📦 +${qtd} galões para *${alvo.getNome()}*. Total: ${alvo.getSaldo()}X`,
            );
          }
          break;
        }
        case "!remover": {
          if (args.length < 2) {
            await msg.reply("❌ Use: !remover [nome] ou !remover [nº] [nome]");
            return;
          }
          if (isNaN(Number(args[1]))) {
            const nome = args.slice(1).join(" ");
            await this.useCase.removerPessoa(nome);
            await msg.reply("🗑️ Pessoa removida com sucesso.");
          } else {
            const qtd = parseInt(args[1]);
            const nome = args.slice(2).join(" ");
            const alvo = await this.useCase.removerGaloes(nome, qtd);
            await msg.reply(
              `➖ -${qtd} galões de *${alvo.getNome()}*. Total: ${alvo.getSaldo()}X`,
            );
          }
          break;
        }
        case "!trocou": {
          if (args.length < 2) {
            await msg.reply("❌ Use: !trocou [nome]");
            return;
          }
          const nome = args.slice(1).join(" ");
          const pessoa = await this.useCase.registrarTroca(nome);
          await msg.reply(
            `✅ *${pessoa.getNome()}* trocou o galão e foi para o fim da fila.`,
          );
          break;
        }
        case "!pular": {
          if (args.length < 2) {
            await msg.reply("❌ Use: !pular [nome]");
            return;
          }
          const nome = args.slice(1).join(" ");
          const pessoa = await this.useCase.pularVez(nome);
          await msg.reply(`✨ *${pessoa.getNome()}* usou 3X e pulou a vez!`);
          break;
        }
        case "!ajuda": {
          await msg.reply(
            "*📖 Guia Corporativo - WaterBot DTIC:*\n\n" +
              "• `!fila`: Mostra a ordem e saldo.\n" +
              "• `!trocou [Nome]`: Registra quem trocou a água.\n" +
              "• `!pular [Nome]`: Gasta 3X para pular a vez.\n" +
              "• `!adicionar [Nome]`: Cadastra novo servidor.\n" +
              "• `!adicionar [N] [Nome]`: Adiciona galões ao saldo.\n" +
              "• `!remover [Nome]`: Remove da lista.\n" +
              "• `!remover [N] [Nome]`: Subtrai galões.",
          );
          break;
        }
      }
    } catch (error: any) {
      await msg.reply(`❌ ${error.message}`);
    }
  }
}
