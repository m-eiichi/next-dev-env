import "server-only";
import { Todo } from "@/server/domain/todo/entity";
import type { TodoRepository } from "@/server/domain/todo/repository";
import { toTodoDto, type TodoDto } from "@/server/application/dto/todo/todo.dto";

// 全員が使える画面なので、認証チェックはしない（docs/03_画面設計/SCR-030_TODO一覧.md）
export class CreateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: { title: string }): Promise<TodoDto> {
    const todo = Todo.create(input, new Date());
    await this.todoRepository.save(todo);
    return toTodoDto(todo);
  }
}
