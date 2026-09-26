import "server-only";
import { TodoNotFoundError } from "@/server/domain/todo/errors";
import type { TodoRepository } from "@/server/domain/todo/repository";
import { toTodoDto, type TodoDto } from "@/server/application/dto/todo/todo.dto";

// 変更の見本: 取り出す → エンティティのメソッドで変える → 保存
// 全員が使える画面なので、認証チェックはしない（docs/03_画面設計/SCR-030_TODO一覧.md）
export class CompleteTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string): Promise<TodoDto> {
    // 1. 今の状態を取り出す。なければ見つからないエラー
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new TodoNotFoundError();
    }

    // 2. 状態の変化のルール（すでに完了していないか）はエンティティのメソッドが守る
    todo.complete(new Date());

    // 3. 保存して、DTO で返す
    await this.todoRepository.save(todo);
    return toTodoDto(todo);
  }
}
