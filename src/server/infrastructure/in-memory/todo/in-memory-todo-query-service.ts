import "server-only";
import type { TodoDto, TodoStatusFilter } from "@/server/application/dto/todo/todo.dto";
import type { TodoQueryService } from "@/server/application/query/todo/todo-query-service";
import { todoRows, type TodoRow } from "./in-memory-todo-store";

// 読み取り側。エンティティを通さず、仮のデータから DTO を直接作る
export class InMemoryTodoQueryService implements TodoQueryService {
  async list(filter: { status?: TodoStatusFilter }): Promise<TodoDto[]> {
    const rows = todoRows.filter((row) => {
      if (filter.status === "open") return row.completedAt === null;
      if (filter.status === "completed") return row.completedAt !== null;
      return true;
    });
    return rows.map(toDto);
  }

  async findById(id: string): Promise<TodoDto | null> {
    const row = todoRows.find((item) => item.id === id);
    return row ? toDto(row) : null;
  }
}

function toDto(row: TodoRow): TodoDto {
  return {
    id: row.id,
    title: row.title,
    completed: row.completedAt !== null,
    createdAt: row.createdAt,
    completedAt: row.completedAt,
  };
}
