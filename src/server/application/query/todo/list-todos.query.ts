import "server-only";
import type { TodoDto, TodoStatusFilter } from "@/server/application/dto/todo/todo.dto";
import type { TodoQueryService } from "./todo-query-service";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-030_TODO一覧.md）
export class ListTodosQuery {
  constructor(private readonly todoQueryService: TodoQueryService) {}

  async execute(input: { status?: TodoStatusFilter } = {}): Promise<TodoDto[]> {
    return this.todoQueryService.list({ status: input.status });
  }
}
