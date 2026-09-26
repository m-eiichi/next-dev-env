import { describe, expect, it, vi } from "vitest";
import { DeleteTodoUseCase } from "./delete-todo.usecase";
import { Todo } from "@/server/domain/todo/entity";
import { TodoNotFoundError } from "@/server/domain/todo/errors";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

function createRepository(todo: Todo | null) {
  return { findById: vi.fn(async () => todo), save: vi.fn(), delete: vi.fn(async () => {}) };
}

describe("DeleteTodoUseCase", () => {
  it("TODO を削除する", async () => {
    const todo = Todo.reconstruct({ id: "t1", title: "資料を読む", createdAt: new Date(), completedAt: null });
    const repository = createRepository(todo);

    await new DeleteTodoUseCase(repository).execute("t1");

    expect(repository.delete).toHaveBeenCalledWith("t1");
  });

  it("見つからなければ TodoNotFoundError になり、削除しない", async () => {
    const repository = createRepository(null);

    await expect(new DeleteTodoUseCase(repository).execute("none")).rejects.toThrow(TodoNotFoundError);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
