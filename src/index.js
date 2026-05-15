const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const servico = require("./ServicoAgua");

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./sessions" }),
  puppeteer: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
});

client.on("qr", (qr) => qrcode.generate(qr, { small: true }));
client.on("ready", () => console.log("WaterBot DTIC Online!"));

client.on("message_create", async (msg) => {
  const args = msg.body.trim().split(/\s+/);
  const comando = args[0].toLowerCase();

  switch (comando) {
    case "!fila":
      const lista = servico.obterFila();
      let textoFila = "*💧 Fila da Água DTIC*\n\n";
      lista.forEach((m, i) => (textoFila += `${i + 1}. ${m.nome} [${m.x}X]\n`));
      msg.reply(textoFila);
      break;

    case "!adicionar":
      if (args.length < 2)
        return msg.reply("❌ Use: !adicionar [nome] ou !adicionar [nº] [nome]");
      if (isNaN(args[1])) {
        const nome = args.slice(1).join(" ");
        const novo = servico.adicionarPessoa(nome);
        msg.reply(
          novo ? `✅ *${novo.nome}* adicionado.` : "⚠️ Nome já existe.",
        );
      } else {
        const qtd = parseInt(args[1]);
        const nome = args.slice(2).join(" ");
        const alvo = servico.alterarGaloes(nome, qtd, "soma");
        msg.reply(
          alvo
            ? `📦 +${qtd} galões para *${alvo.nome}*. Total: ${alvo.x}X`
            : "❌ Nome não encontrado.",
        );
      }
      break;

    case "!remover":
      if (args.length < 2)
        return msg.reply("❌ Use: !remover [nome] ou !remover [nº] [nome]");
      if (isNaN(args[1])) {
        const sucesso = servico.removerPessoa(args.slice(1).join(" "));
        msg.reply(sucesso ? "🗑️ Pessoa removida." : "❌ Nome não encontrado.");
      } else {
        const qtd = parseInt(args[1]);
        const nome = args.slice(2).join(" ");
        const alvo = servico.alterarGaloes(nome, qtd, "subtrai");
        msg.reply(
          alvo
            ? `➖ -${qtd} galões de *${alvo.nome}*. Total: ${alvo.x}X`
            : "❌ Nome não encontrado.",
        );
      }
      break;

    case "!trocou":
      if (args.length < 2) return msg.reply("❌ Use: !trocou [nome]");
      const pessoaTroca = servico.registrarTroca(args.slice(1).join(" "));
      msg.reply(
        pessoaTroca
          ? `✅ *${pessoaTroca.nome}* trocou o galão e foi para o fim da fila.`
          : "❌ Nome não encontrado.",
      );
      break;

    case "!pular":
      if (args.length < 2) return msg.reply("❌ Use: !pular [nome]");
      const pessoaPulo = servico.pularVez(args.slice(1).join(" "));
      msg.reply(
        pessoaPulo
          ? `✨ *${pessoaPulo.nome}* usou 3X e pulou a vez!`
          : "❌ Saldo insuficiente (mínimo 3X) ou nome não encontrado.",
      );
      break;

    case "!ajuda":
      msg.reply(
        "*📖 Comandos WaterBot:*\n\n" +
          "• `!fila`: Ordem de troca e saldo.\n" +
          "• `!trocou [Nome]`: Registra quem trocou agora.\n" +
          "• `!pular [Nome]`: Usa 3X para pular a vez.\n" +
          "• `!adicionar [Nome]`: Novo na lista.\n" +
          "• `!adicionar [N] [Nome]`: Soma N galões.\n" +
          "• `!remover [Nome]`: Tira da lista.\n" +
          "• `!remover [N] [Nome]`: Subtrai N galões.",
      );
      break;
  }
});

client.initialize();
