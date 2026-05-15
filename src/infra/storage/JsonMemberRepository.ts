import fs from "fs";
import path from "path";
import { Membro } from "../../domain/entities/Membro";
import { IMemberRepository } from "../../domain/repositories/IMemberRepository";

export class JsonMemberRepository implements IMemberRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, "../../../../data/membros.json");
  }

  public async obterTodos(): Promise<Membro[]> {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }
    const data = fs.readFileSync(this.filePath, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.map((m: any) => new Membro(m.nome, m.x));
  }

  public async salvarTodos(membros: Membro[]): Promise<void> {
    const rawData = membros.map((m) => ({
      nome: m.getNome(),
      x: m.getSaldo(),
    }));
    fs.writeFileSync(this.filePath, JSON.stringify(rawData, null, 2));
  }
}
