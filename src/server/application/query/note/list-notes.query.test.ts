import { describe, expect, it, vi } from "vitest";
import { ListNotesQuery } from "./list-notes.query";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

describe("ListNotesQuery", () => {
  it("Query Service の一覧をそのまま返す", async () => {
    const notes = [
      { id: "e1", title: "タイトル 1", body: "本文" },
      { id: "e2", title: "タイトル 2", body: null },
    ];
    const queryService = { list: vi.fn(async () => notes) };

    const result = await new ListNotesQuery(queryService).execute();

    expect(queryService.list).toHaveBeenCalledOnce();
    expect(result).toEqual(notes);
  });

  it("検索語の前後の空白を取り除いて Query Service に渡す", async () => {
    const queryService = { list: vi.fn(async () => []) };

    await new ListNotesQuery(queryService).execute({ keyword: "  query  " });

    expect(queryService.list).toHaveBeenCalledWith({ keyword: "query" });
  });

  it("検索語が空白だけなら条件なし（全件）で取得する", async () => {
    const queryService = { list: vi.fn(async () => []) };

    await new ListNotesQuery(queryService).execute({ keyword: "   " });

    expect(queryService.list).toHaveBeenCalledWith({ keyword: undefined });
  });
});
