const fs = require("fs");
const path = require("path");

class RepositorioMembros {
  constructor() {
    this.caminho = path.join(__dirname, "../data/membros.json");
  }

  obterTodos() {
    if (!fs.existsSync(this.caminho)) return [];
    const data = fs.readFileSync(this.caminho, "utf-8");
    return JSON.parse(data);
  }

  salvar(membros) {
    fs.writeFileSync(this.caminho, JSON.stringify(membros, null, 2));
  }
}

module.exports = new RepositorioMembros();
