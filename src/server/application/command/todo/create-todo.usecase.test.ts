import { describe, expect, it, vi } from "vitest";
import { CreateTodoUseCase } from "./create-todo.usecase";
import { DomainError } from "@/server/domain/shared/domain-error";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

function createRepository() {
  return { findById: vi.fn(), save: vi.fn(async () => {}), delete: vi.fn() };
}

describe("CreateTodoUseCase", () => {
  it("未完了の TODO を保存し、DTO で返す", async () => {
    const repository = createRepository();

    const result = await new CreateTodoUseCase(repository).execute({ title: "  資料を読む  " });

    expect(repository.save).toHaveBeenCalledOnce();
    expect(result).toEqual({
      id: expect.any(String),
      title: "資料を読む",
      completed: false,
      createdAt: expect.any(String),
      completedAt: null,
    });
  });

  it("タイトルがルールに合わなければ DomainError になり、保存しない", async () => {
    const repository = createRepository();

    await expect(new CreateTodoUseCase(repository).execute({ title: "" })).rejects.toThrow(DomainError);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
