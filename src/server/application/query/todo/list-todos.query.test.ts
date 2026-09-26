import { describe, expect, it, vi } from "vitest";
import { ListTodosQuery } from "./list-todos.query";
import type { TodoDto } from "@/server/application/dto/todo/todo.dto";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

const TODO: TodoDto = {
  id: "t1",
  title: "資料を読む",
  completed: false,
  createdAt: "2026-09-26T09:00:00.000Z",
  completedAt: null,
};

describe("ListTodosQuery", () => {
  it("絞り込みの条件を Query Service に渡し、一覧をそのまま返す", async () => {
    const queryService = { list: vi.fn(async () => [TODO]), findById: vi.fn() };

    const result = await new ListTodosQuery(queryService).execute({ status: "open" });

    expect(queryService.list).toHaveBeenCalledWith({ status: "open" });
    expect(result).toEqual([TODO]);
  });

  it("条件がなければ、すべてを取得する", async () => {
    const queryService = { list: vi.fn(async () => []), findById: vi.fn() };

    await new ListTodosQuery(queryService).execute();

    expect(queryService.list).toHaveBeenCalledWith({ status: undefined });
  });
});
