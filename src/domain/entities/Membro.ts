export class Membro {
  private nome: string;
  private x: number;

  constructor(nome: string, x: number = 0) {
    this.nome = nome;
    this.x = Math.max(0, x);
  }

  public getNome(): string {
    return this.nome;
  }

  public getSaldo(): number {
    return this.x;
  }

  public adicionarGaloes(quantidade: number): void {
    if (quantidade < 0)
      throw new Error("A quantidade deve ser maior que zero.");
    this.x += quantidade;
  }

  public removerGaloes(quantidade: number): void {
    if (quantidade < 0)
      throw new Error("A quantidade deve ser maior que zero.");
    this.x = Math.max(0, this.x - quantidade);
  }

  public podePularVez(): boolean {
    return this.x >= 3;
  }

  public usarPulo(): void {
    if (!this.podePularVez()) {
      throw new Error(
        `Saldo insuficiente. ${this.nome} possui apenas ${this.x}X.`,
      );
    }
    this.x -= 3;
  }
}
