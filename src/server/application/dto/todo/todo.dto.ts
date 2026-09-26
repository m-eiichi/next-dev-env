import type { Todo } from "@/server/domain/todo/entity";

// 画面に渡してよい項目だけを持つプレーンなオブジェクト
export type TodoDto = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO 8601
  completedAt: string | null; // ISO 8601
};

// 一覧の絞り込み（URL の ?status=）。なければすべて
export type TodoStatusFilter = "open" | "completed";

export function toTodoDto(todo: Todo): TodoDto {
  return {
    id: todo.id,
    title: todo.title.value,
    completed: todo.isCompleted,
    createdAt: todo.createdAt.toISOString(),
    completedAt: todo.completedAt?.toISOString() ?? null,
  };
}
