import { describe, expect, it } from "vitest";
import { Todo } from "@/server/domain/todo/entity";
import { InMemoryTodoQueryService } from "./in-memory-todo-query-service";
import { InMemoryTodoRepository } from "./in-memory-todo-repository";

// 更新（リポジトリ）と読み取り（Query Service）が、同じ仮のデータを共有していることを確かめる
describe("InMemoryTodoRepository", () => {
  const repository = new InMemoryTodoRepository();
  const queryService = new InMemoryTodoQueryService();

  it("追加した TODO が、読み取り側の一覧の先頭に出る", async () => {
    const todo = Todo.create({ title: "追加のテスト" }, new Date("2026-09-26T09:00:00Z"));

    await repository.save(todo);
    const [first] = await queryService.list({});

    expect(first).toMatchObject({ id: todo.id, title: "追加のテスト", completed: false });
  });

  it("取り出して完了にし、保存すると、完了の絞り込みに出る", async () => {
    const todo = await repository.findById("todo-1");
    todo!.complete(new Date("2026-09-26T10:00:00Z"));
    await repository.save(todo!);

    const completed = await queryService.list({ status: "completed" });
    const open = await queryService.list({ status: "open" });

    expect(completed.map((item) => item.id)).toContain("todo-1");
    expect(open.map((item) => item.id)).not.toContain("todo-1");
  });

  it("削除すると、読み取り側から見つからなくなる", async () => {
    await repository.delete("todo-2");

    expect(await queryService.findById("todo-2")).toBeNull();
    expect(await repository.findById("todo-2")).toBeNull();
  });
});
