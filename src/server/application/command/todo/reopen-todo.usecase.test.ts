import { describe, expect, it, vi } from "vitest";
import { ReopenTodoUseCase } from "./reopen-todo.usecase";
import { Todo } from "@/server/domain/todo/entity";
import { TodoNotFoundError } from "@/server/domain/todo/errors";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

const CREATED_AT = new Date("2026-09-26T09:00:00Z");

function createRepository(todo: Todo | null) {
  return { findById: vi.fn(async () => todo), save: vi.fn(async () => {}), delete: vi.fn() };
}

describe("ReopenTodoUseCase", () => {
  it("完了した TODO を未完了に戻して保存し、DTO で返す", async () => {
    const todo = Todo.reconstruct({ id: "t1", title: "資料を読む", createdAt: CREATED_AT, completedAt: CREATED_AT });
    const repository = createRepository(todo);

    const result = await new ReopenTodoUseCase(repository).execute("t1");

    expect(repository.save).toHaveBeenCalledWith(todo);
    expect(result.completed).toBe(false);
    expect(result.completedAt).toBeNull();
  });

  it("まだ完了していなければ DomainError になり、保存しない", async () => {
    const todo = Todo.reconstruct({ id: "t1", title: "資料を読む", createdAt: CREATED_AT, completedAt: null });
    const repository = createRepository(todo);

    await expect(new ReopenTodoUseCase(repository).execute("t1")).rejects.toThrow("まだ完了していません");
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("見つからなければ TodoNotFoundError になる", async () => {
    await expect(new ReopenTodoUseCase(createRepository(null)).execute("none")).rejects.toThrow(TodoNotFoundError);
  });
});
