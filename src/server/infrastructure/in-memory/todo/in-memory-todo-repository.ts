import "server-only";
import { Todo } from "@/server/domain/todo/entity";
import type { TodoRepository } from "@/server/domain/todo/repository";
import { todoRows, type TodoRow } from "./in-memory-todo-store";

// 更新側。DB の行とエンティティを変換して、仮のデータ置き場を読み書きする
export class InMemoryTodoRepository implements TodoRepository {
  async findById(id: string): Promise<Todo | null> {
    const row = todoRows.find((item) => item.id === id);
    return row ? toEntity(row) : null;
  }

  async save(todo: Todo): Promise<void> {
    const row = toRow(todo);
    const index = todoRows.findIndex((item) => item.id === todo.id);
    if (index === -1) {
      // 新しいものほど先頭に置く
      todoRows.unshift(row);
    } else {
      todoRows[index] = row;
    }
  }

  async delete(id: string): Promise<void> {
    const index = todoRows.findIndex((item) => item.id === id);
    if (index !== -1) {
      todoRows.splice(index, 1);
    }
  }
}

function toEntity(row: TodoRow): Todo {
  return Todo.reconstruct({
    id: row.id,
    title: row.title,
    createdAt: new Date(row.createdAt),
    completedAt: row.completedAt ? new Date(row.completedAt) : null,
  });
}

function toRow(todo: Todo): TodoRow {
  return {
    id: todo.id,
    title: todo.title.value,
    createdAt: todo.createdAt.toISOString(),
    completedAt: todo.completedAt?.toISOString() ?? null,
  };
}
