const repositorio = require("./RepositorioMembros");

class ServicoAgua {
  obterFila() {
    return repositorio.obterTodos();
  }

  adicionarPessoa(nome) {
    const membros = repositorio.obterTodos();
    if (this._buscarIndex(membros, nome) !== -1) return null;

    const novo = { nome, x: 0 };
    membros.push(novo);
    repositorio.salvar(membros);
    return novo;
  }

  removerPessoa(nome) {
    let membros = repositorio.obterTodos();
    const inicial = membros.length;
    membros = membros.filter(
      (m) => m.nome.toLowerCase() !== nome.toLowerCase(),
    );

    if (membros.length < inicial) {
      repositorio.salvar(membros);
      return true;
    }
    return false;
  }

  alterarGaloes(nome, quantidade, operacao = "soma") {
    const membros = repositorio.obterTodos();
    const index = this._buscarIndex(membros, nome);

    if (index !== -1) {
      if (operacao === "soma") membros[index].x += quantidade;
      else membros[index].x = Math.max(0, membros[index].x - quantidade);

      repositorio.salvar(membros);
      return membros[index];
    }
    return null;
  }

  registrarTroca(nome) {
    const membros = repositorio.obterTodos();
    const index = this._buscarIndex(membros, nome);

    if (index !== -1) {
      const [pessoa] = membros.splice(index, 1); // Tira da posição atual
      membros.push(pessoa); // Coloca no final
      repositorio.salvar(membros);
      return pessoa;
    }
    return null;
  }

  // Regra dos 3X: Pular a vez
  pularVez(nome) {
    const membros = repositorio.obterTodos();
    const index = this._buscarIndex(membros, nome);

    if (index !== -1 && membros[index].x >= 3) {
      membros[index].x -= 3;
      const [pessoa] = membros.splice(index, 1);
      membros.push(pessoa);
      repositorio.salvar(membros);
      return pessoa;
    }
    return null;
  }

  _buscarIndex(membros, nome) {
    return membros.findIndex(
      (m) => m.nome.toLowerCase() === nome.toLowerCase(),
    );
  }
}

module.exports = new ServicoAgua();
