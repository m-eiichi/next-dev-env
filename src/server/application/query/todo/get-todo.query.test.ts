import { describe, expect, it, vi } from "vitest";
import { GetTodoQuery } from "./get-todo.query";
import type { TodoDto } from "@/server/application/dto/todo/todo.dto";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

const TODO: TodoDto = {
  id: "t1",
  title: "資料を読む",
  completed: false,
  createdAt: "2026-09-26T09:00:00.000Z",
  completedAt: null,
};

describe("GetTodoQuery", () => {
  const queryService = {
    list: vi.fn(),
    findById: vi.fn(async (id: string) => (id === TODO.id ? TODO : null)),
  };

  it("ID で 1 件を返す", async () => {
    expect(await new GetTodoQuery(queryService).execute("t1")).toEqual(TODO);
  });

  it("見つからなければ null を返す", async () => {
    expect(await new GetTodoQuery(queryService).execute("none")).toBeNull();
  });
});
