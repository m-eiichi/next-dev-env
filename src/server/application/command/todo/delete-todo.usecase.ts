import "server-only";
import { TodoNotFoundError } from "@/server/domain/todo/errors";
import type { TodoRepository } from "@/server/domain/todo/repository";

// 全員が使える画面なので、認証チェックはしない（docs/03_画面設計/SCR-030_TODO一覧.md）
export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string): Promise<void> {
    // 消す前に、あることを確かめる（なければ見つからないエラー）
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new TodoNotFoundError();
    }
    await this.todoRepository.delete(todo.id);
  }
}
