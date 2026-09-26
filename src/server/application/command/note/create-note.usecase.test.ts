import { describe, expect, it, vi } from "vitest";
import { CreateNoteUseCase } from "./create-note.usecase";
import { DuplicateNoteTitleError } from "@/server/domain/note/errors";
import { DomainError } from "@/server/domain/shared/domain-error";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

function createRepository(existsByTitle = false) {
  return {
    save: vi.fn(async () => {}),
    existsByTitle: vi.fn(async () => existsByTitle),
  };
}

describe("CreateNoteUseCase", () => {
  it("メモを保存し、DTO で返す", async () => {
    const repository = createRepository();

    const result = await new CreateNoteUseCase(repository).execute({
      title: "  新しいメモ  ",
      body: "本文",
    });

    expect(repository.save).toHaveBeenCalledOnce();
    expect(result).toEqual({ id: expect.any(String), title: "新しいメモ", body: "本文" });
  });

  it("前後の空白を除いたタイトルで、重複を確かめる", async () => {
    const repository = createRepository();

    await new CreateNoteUseCase(repository).execute({ title: "  新しいメモ  ", body: null });

    expect(repository.existsByTitle).toHaveBeenCalledWith(
      expect.objectContaining({ value: "新しいメモ" }),
    );
  });

  it("同じタイトルがあれば DuplicateNoteTitleError になり、保存しない", async () => {
    const repository = createRepository(true);

    await expect(
      new CreateNoteUseCase(repository).execute({ title: "既存のメモ", body: null }),
    ).rejects.toThrow(DuplicateNoteTitleError);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("タイトルがルールに合わなければ DomainError になり、重複の確認も保存もしない", async () => {
    const repository = createRepository();

    await expect(
      new CreateNoteUseCase(repository).execute({ title: "", body: null }),
    ).rejects.toThrow(DomainError);
    expect(repository.existsByTitle).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });
});
