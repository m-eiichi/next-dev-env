import { describe, expect, it, vi } from "vitest";
import { ListTechStackUseCase } from "./list-tech-stack.usecase";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

describe("ListTechStackUseCase", () => {
  it("リポジトリの一覧を DTO に変換して返す", async () => {
    const repository = {
      list: vi.fn(async () => [{ name: "Next.js", version: "16", usage: "App Router" }]),
    };

    const result = await new ListTechStackUseCase(repository).execute();

    expect(repository.list).toHaveBeenCalledOnce();
    expect(result).toEqual([{ name: "Next.js", version: "16", usage: "App Router" }]);
  });

  it("0 件なら空の配列を返す", async () => {
    const result = await new ListTechStackUseCase({ list: vi.fn(async () => []) }).execute();

    expect(result).toEqual([]);
  });
});
