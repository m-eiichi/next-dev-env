import "server-only";
import type { TodoDto } from "@/server/application/dto/todo/todo.dto";
import type { TodoQueryService } from "./todo-query-service";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-031_TODO詳細.md）
// 見つからなければ null を返す。404 にするかどうかは画面が決める
export class GetTodoQuery {
  constructor(private readonly todoQueryService: TodoQueryService) {}

  async execute(id: string): Promise<TodoDto | null> {
    return this.todoQueryService.findById(id);
  }
}
