import { describe, expect, it, vi } from "vitest";
import { CompleteTodoUseCase } from "./complete-todo.usecase";
import { Todo } from "@/server/domain/todo/entity";
import { TodoNotFoundError } from "@/server/domain/todo/errors";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

const CREATED_AT = new Date("2026-09-26T09:00:00Z");

function createRepository(todo: Todo | null) {
  return { findById: vi.fn(async () => todo), save: vi.fn(async () => {}), delete: vi.fn() };
}

describe("CompleteTodoUseCase", () => {
  it("未完了の TODO を完了にして保存し、DTO で返す", async () => {
    const todo = Todo.reconstruct({ id: "t1", title: "資料を読む", createdAt: CREATED_AT, completedAt: null });
    const repository = createRepository(todo);

    const result = await new CompleteTodoUseCase(repository).execute("t1");

    expect(repository.findById).toHaveBeenCalledWith("t1");
    expect(repository.save).toHaveBeenCalledWith(todo);
    expect(result.completed).toBe(true);
    expect(result.completedAt).not.toBeNull();
  });

  it("すでに完了していれば DomainError になり、保存しない", async () => {
    const todo = Todo.reconstruct({ id: "t1", title: "資料を読む", createdAt: CREATED_AT, completedAt: CREATED_AT });
    const repository = createRepository(todo);

    await expect(new CompleteTodoUseCase(repository).execute("t1")).rejects.toThrow("すでに完了しています");
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("見つからなければ TodoNotFoundError になる", async () => {
    const repository = createRepository(null);

    await expect(new CompleteTodoUseCase(repository).execute("none")).rejects.toThrow(TodoNotFoundError);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
