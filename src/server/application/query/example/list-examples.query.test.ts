import { describe, expect, it, vi } from "vitest";
import { ListExamplesQuery } from "./list-examples.query";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

describe("ListExamplesQuery", () => {
  it("Query Service の一覧をそのまま返す", async () => {
    const examples = [
      { id: "e1", title: "タイトル 1", description: "説明" },
      { id: "e2", title: "タイトル 2", description: null },
    ];
    const queryService = { list: vi.fn(async () => examples) };

    const result = await new ListExamplesQuery(queryService).execute();

    expect(queryService.list).toHaveBeenCalledOnce();
    expect(result).toEqual(examples);
  });

  it("検索語の前後の空白を取り除いて Query Service に渡す", async () => {
    const queryService = { list: vi.fn(async () => []) };

    await new ListExamplesQuery(queryService).execute({ keyword: "  query  " });

    expect(queryService.list).toHaveBeenCalledWith({ keyword: "query" });
  });

  it("検索語が空白だけなら条件なし（全件）で取得する", async () => {
    const queryService = { list: vi.fn(async () => []) };

    await new ListExamplesQuery(queryService).execute({ keyword: "   " });

    expect(queryService.list).toHaveBeenCalledWith({ keyword: undefined });
  });
});
