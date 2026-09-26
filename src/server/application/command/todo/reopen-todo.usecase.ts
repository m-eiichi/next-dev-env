import "server-only";
import { TodoNotFoundError } from "@/server/domain/todo/errors";
import type { TodoRepository } from "@/server/domain/todo/repository";
import { toTodoDto, type TodoDto } from "@/server/application/dto/todo/todo.dto";

// 全員が使える画面なので、認証チェックはしない（docs/03_画面設計/SCR-030_TODO一覧.md）
export class ReopenTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string): Promise<TodoDto> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new TodoNotFoundError();
    }

    todo.reopen();

    await this.todoRepository.save(todo);
    return toTodoDto(todo);
  }
}
