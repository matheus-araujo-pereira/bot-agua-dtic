WATERBOT DTIC

Sistema corporativo automatizado para gestão da fila de troca de galão de água, desenvolvido para o setor de TI (DTIC) da Secretaria Municipal da Fazenda (SEMFAZ).

--- SOBRE O PROJETO ---
O bot foi construído para resolver um problema cotidiano do setor: gerenciar a vez de quem deve trocar o galão de água, aplicando regras de negócio específicas da equipe (como o limite de idade e o sistema de acúmulo de créditos).

--- ARQUITETURA E PADRÕES ---
O projeto foi desenvolvido em TypeScript seguindo estritamente os princípios do SOLID e da Clean Architecture (Arquitetura Limpa):

- Domain: Regras de negócio puras encapsuladas na entidade "Membro".
- Use Cases: Orquestração do sistema de fila e créditos (GerenciadorFilaUseCase).
- Adapters: Controladores isolados para interpretar mensagens do WhatsApp (WhatsAppController).
- Infra: Implementação de persistência em arquivos JSON isolada do núcleo (JsonMemberRepository).

--- FUNCIONALIDADES E REGRAS DE NEGÓCIO ---

1. Filtro de Grupo: O bot opera com trava de segurança (ALLOWED_GROUP_ID), ignorando chats privados ou outros grupos para evitar spam.
2. Ciclo de Troca: Ao utilizar !trocou, o usuário cede a vez e vai para o final da fila.
3. Sistema de Créditos (3X): Cada galão trazido gera créditos. Acumulando 3X, o membro pode invocar o comando !pular para ir para o fim da fila sem trocar a água, consumindo o saldo.

--- COMANDOS DISPONÍVEIS ---
!fila -> Mostra a ordem atual e o saldo de galões.
!trocou [Nome] -> Registra a troca e move o usuário para o fim da fila.
!pular [Nome] -> Usa 3X para pular a vez.
!adicionar [Nome] -> Cadastra um novo servidor na lista.
!adicionar [N] [Nome]-> Adiciona N galões ao saldo do usuário.
!remover [Nome] -> Remove um servidor da lista.
!remover [N] [Nome] -> Subtrai N galões do saldo do usuário.

--- COMO RODAR LOCALMENTE ---

1. Pré-requisitos:
   Node.js (v18+) e NPM instalados. No Linux, bibliotecas do Chromium (alsa-lib, pango, etc.) são necessárias.

2. Instalação:
   No terminal, execute o comando: npm install

3. Configuração:
   Crie um arquivo chamado .env na raiz do projeto com o seguinte conteúdo:
   NODE_ENV=development
   ALLOWED_GROUP_ID=1234567890@g.us (Cole o ID do seu grupo aqui)

(Dica: Inicie o bot sem o ID e use o comando !meuid no grupo desejado para descobrir o identificador).

4. Execução em Desenvolvimento:
   No terminal, execute o comando: npm run dev

5. Gerando Build para Produção:
   No terminal, execute o comando: npm run build
   E depois: npm start
