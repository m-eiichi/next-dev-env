import { describe, expect, it, vi } from "vitest";
import { ListExamplesUseCase } from "./list-examples.usecase";
import { Example } from "@/server/domain/example/entity";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

describe("ListExamplesUseCase", () => {
  it("リポジトリの一覧を DTO に変換して返す", async () => {
    const repository = {
      list: vi.fn(async () => [
        Example.reconstruct({ id: "e1", title: "タイトル 1", description: "説明" }),
        Example.reconstruct({ id: "e2", title: "タイトル 2", description: null }),
      ]),
    };

    const result = await new ListExamplesUseCase(repository).execute();

    expect(repository.list).toHaveBeenCalledOnce();
    expect(result).toEqual([
      { id: "e1", title: "タイトル 1", description: "説明" },
      { id: "e2", title: "タイトル 2", description: null },
    ]);
  });

  it("0 件なら空の配列を返す", async () => {
    const result = await new ListExamplesUseCase({ list: vi.fn(async () => []) }).execute();

    expect(result).toEqual([]);
  });
});
