import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { container } from "@/server/infrastructure/di/container";
import { GetTodoQuery } from "@/server/application/query/todo/get-todo.query";
import type { TodoDto } from "@/server/application/dto/todo/todo.dto";

// 見つからなければ null を返す。404 にするのは画面（docs/03_画面設計/SCR-031_TODO詳細.md）
export async function getTodo(id: string): Promise<TodoDto | null> {
  "use cache";
  cacheLife("max");
  cacheTag("todos");

  // Composition Root: 依存を組み立ててクエリを作る
  const query = new GetTodoQuery(container.todoQueryService());
  return query.execute(id);
}
