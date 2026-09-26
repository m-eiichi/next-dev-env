import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { container } from "@/server/infrastructure/di/container";
import { ListTodosQuery } from "@/server/application/query/todo/list-todos.query";
import type { TodoDto, TodoStatusFilter } from "@/server/application/dto/todo/todo.dto";

export async function listTodos(status?: TodoStatusFilter): Promise<TodoDto[]> {
  // status は引数なので、キャッシュのキーに入る（絞り込みごとに別に保存される）
  // 変わるのは追加・完了・元に戻す・削除のときだけなので、そのときにタグで捨てる（docs/03_画面設計/SCR-030_TODO一覧.md の「7.1」）
  "use cache";
  cacheLife("max");
  cacheTag("todos");

  // Composition Root: 依存を組み立ててクエリを作る
  const query = new ListTodosQuery(container.todoQueryService());
  return query.execute({ status });
}
