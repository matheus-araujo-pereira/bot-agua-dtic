import { Membro } from "../entities/Membro";

export interface IMemberRepository {
  obterTodos(): Promise<Membro[]>;
  salvarTodos(membros: Membro[]): Promise<void>;
}
