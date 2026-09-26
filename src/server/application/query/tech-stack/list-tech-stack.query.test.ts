import { describe, expect, it, vi } from "vitest";
import { ListTechStackQuery } from "./list-tech-stack.query";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

describe("ListTechStackQuery", () => {
  it("Query Service の一覧をそのまま返す", async () => {
    const item = { name: "Next.js", version: "16", usage: "App Router", url: "https://nextjs.org" };
    const queryService = { list: vi.fn(async () => [item]) };

    const result = await new ListTechStackQuery(queryService).execute();

    expect(queryService.list).toHaveBeenCalledOnce();
    expect(result).toEqual([item]);
  });
});
