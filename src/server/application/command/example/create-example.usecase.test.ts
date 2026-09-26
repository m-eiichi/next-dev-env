import { describe, expect, it, vi } from "vitest";
import { CreateExampleUseCase } from "./create-example.usecase";
import { DuplicateExampleTitleError } from "@/server/domain/example/errors";
import { DomainError } from "@/server/domain/shared/domain-error";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

function createRepository(existsByTitle = false) {
  return {
    save: vi.fn(async () => {}),
    existsByTitle: vi.fn(async () => existsByTitle),
  };
}

describe("CreateExampleUseCase", () => {
  it("サンプルを保存し、DTO で返す", async () => {
    const repository = createRepository();

    const result = await new CreateExampleUseCase(repository).execute({
      title: "  新しいサンプル  ",
      description: "説明",
    });

    expect(repository.save).toHaveBeenCalledOnce();
    expect(result).toEqual({ id: expect.any(String), title: "新しいサンプル", description: "説明" });
  });

  it("前後の空白を除いたタイトルで、重複を確かめる", async () => {
    const repository = createRepository();

    await new CreateExampleUseCase(repository).execute({ title: "  新しいサンプル  ", description: null });

    expect(repository.existsByTitle).toHaveBeenCalledWith(
      expect.objectContaining({ value: "新しいサンプル" }),
    );
  });

  it("同じタイトルがあれば DuplicateExampleTitleError になり、保存しない", async () => {
    const repository = createRepository(true);

    await expect(
      new CreateExampleUseCase(repository).execute({ title: "既存のサンプル", description: null }),
    ).rejects.toThrow(DuplicateExampleTitleError);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("タイトルがルールに合わなければ DomainError になり、重複の確認も保存もしない", async () => {
    const repository = createRepository();

    await expect(
      new CreateExampleUseCase(repository).execute({ title: "", description: null }),
    ).rejects.toThrow(DomainError);
    expect(repository.existsByTitle).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });
});
