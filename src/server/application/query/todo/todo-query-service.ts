import type { TodoDto, TodoStatusFilter } from "@/server/application/dto/todo/todo.dto";

// 読み取り専用のインターフェース。実装はインフラストラクチャ層
export interface TodoQueryService {
  // 新しいものから順に返す。status がなければすべて
  list(filter: { status?: TodoStatusFilter }): Promise<TodoDto[]>;
  findById(id: string): Promise<TodoDto | null>;
}
