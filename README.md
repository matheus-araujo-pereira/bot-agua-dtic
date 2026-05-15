# 💧 WaterBot DTIC

Sistema automatizado para gestão da fila de troca de galão de água no setor DTIC/SEMFAZ.

## 📋 Regras de Negócio

1. **Filtro de Hardware:** Apenas membros masculinos com menos de 40 anos participam da fila.
2. **Ciclo de Troca:** Ao realizar a troca, o usuário vai para o fim da fila.
3. **Sistema de Créditos (X):**
   - Cada galão trazido para dentro da sala gera **1 X**.
   - Com **3 X**, o usuário pode pular sua vez na troca sem perder a posição de "fim de fila".

## 🚀 Comandos no WhatsApp

- `!lista`: Exibe a fila atual e o saldo de créditos.
- `!troquei`: Move o primeiro da fila para o final.
- `!carreguei [Nome]`: Adiciona 1 crédito ao usuário citado.
- `!pular [Nome]`: Consome 3 créditos e move o usuário para o fim da fila.

## 🛠️ Tecnologias

- Node.js
- whatsapp-web.js
- Fedora 44 Workstation (Ambiente de Dev)

## 📦 Como Rodar

1. Instale as dependências: `npm install`
2. Inicie o bot: `npm start`
3. Escaneie o QR Code com o WhatsApp do setor.
# bot-agua-dtic
