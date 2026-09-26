import { describe, expect, it, vi } from "vitest";
import { CreateReportUseCase } from "./create-report.usecase";
import { DomainError } from "@/server/domain/shared/domain-error";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

function createRepository() {
  return { findById: vi.fn(), save: vi.fn(async () => {}) };
}

describe("CreateReportUseCase", () => {
  it("白紙のドキュメントを保存し、DTO で返す", async () => {
    const repository = createRepository();

    const result = await new CreateReportUseCase(repository).execute({ name: "  請求書  " });

    expect(repository.save).toHaveBeenCalledOnce();
    expect(result).toEqual({
      id: expect.any(String),
      name: "請求書",
      paper: { width: 210, height: 297 },
      elements: [],
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("名前がルールに合わなければ DomainError になり、保存しない", async () => {
    const repository = createRepository();

    await expect(new CreateReportUseCase(repository).execute({ name: "" })).rejects.toThrow(DomainError);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
