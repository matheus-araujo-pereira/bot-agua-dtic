import { Membro } from "../domain/entities/Membro";
import { IMemberRepository } from "../domain/repositories/IMemberRepository";

export class GerenciadorFilaUseCase {
  constructor(private repository: IMemberRepository) {}

  public async obterFila(): Promise<Membro[]> {
    return await this.repository.obterTodos();
  }

  public async registrarTroca(nome: string): Promise<Membro> {
    const fila = await this.repository.obterTodos();
    const index = this.buscarIndex(fila, nome);
    if (index === -1) throw new Error("Nome não encontrado na lista.");
    const [pessoa] = fila.splice(index, 1);
    fila.push(pessoa);
    await this.repository.salvarTodos(fila);
    return pessoa;
  }

  public async adicionarGaloes(
    nome: string,
    quantidade: number,
  ): Promise<Membro> {
    const fila = await this.repository.obterTodos();
    const index = this.buscarIndex(fila, nome);
    if (index === -1) throw new Error("Nome não encontrado na lista.");
    fila[index].adicionarGaloes(quantidade);
    await this.repository.salvarTodos(fila);
    return fila[index];
  }

  public async removerGaloes(
    nome: string,
    quantidade: number,
  ): Promise<Membro> {
    const fila = await this.repository.obterTodos();
    const index = this.buscarIndex(fila, nome);
    if (index === -1) throw new Error("Nome não encontrado na lista.");
    fila[index].removerGaloes(quantidade);
    await this.repository.salvarTodos(fila);
    return fila[index];
  }

  public async pularVez(nome: string): Promise<Membro> {
    const fila = await this.repository.obterTodos();
    const index = this.buscarIndex(fila, nome);
    if (index === -1) throw new Error("Nome não encontrado na lista.");
    fila[index].usarPulo();
    const [pessoa] = fila.splice(index, 1);
    fila.push(pessoa);
    await this.repository.salvarTodos(fila);
    return pessoa;
  }

  public async adicionarPessoa(nome: string): Promise<Membro> {
    const fila = await this.repository.obterTodos();
    if (this.buscarIndex(fila, nome) !== -1) {
      throw new Error("Essa pessoa já está na lista.");
    }
    const novoMembro = new Membro(nome, 0);
    fila.push(novoMembro);
    await this.repository.salvarTodos(fila);
    return novoMembro;
  }

  public async removerPessoa(nome: string): Promise<void> {
    const fila = await this.repository.obterTodos();
    const index = this.buscarIndex(fila, nome);
    if (index === -1) throw new Error("Nome não encontrado na lista.");
    fila.splice(index, 1);
    await this.repository.salvarTodos(fila);
  }

  private buscarIndex(fila: Membro[], nomeBusca: string): number {
    return fila.findIndex(
      (m) => m.getNome().toLowerCase() === nomeBusca.toLowerCase(),
    );
  }
}
