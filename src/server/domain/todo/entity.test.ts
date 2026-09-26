import { describe, expect, it } from "vitest";
import { Todo } from "./entity";
import { DomainError } from "../shared/domain-error";

const NOW = new Date("2026-09-26T09:00:00Z");
const LATER = new Date("2026-09-26T10:00:00Z");

describe("Todo", () => {
  describe("create（新しく作る）", () => {
    it("未完了で作る。ID を割り当て、作った日時を持つ", () => {
      const todo = Todo.create({ title: "  資料を読む  " }, NOW);

      expect(todo.id).not.toBe("");
      expect(todo.title.value).toBe("資料を読む");
      expect(todo.createdAt).toEqual(NOW);
      expect(todo.isCompleted).toBe(false);
      expect(todo.completedAt).toBeNull();
    });

    it("タイトルがルールに合わなければ DomainError になる", () => {
      expect(() => Todo.create({ title: "" }, NOW)).toThrow(DomainError);
    });
  });

  describe("complete（完了にする）", () => {
    it("未完了なら完了にでき、完了した日時を持つ", () => {
      const todo = Todo.create({ title: "資料を読む" }, NOW);

      todo.complete(LATER);

      expect(todo.isCompleted).toBe(true);
      expect(todo.completedAt).toEqual(LATER);
    });

    it("すでに完了していれば DomainError になり、完了した日時は変わらない", () => {
      const todo = Todo.reconstruct({ id: "t1", title: "資料を読む", createdAt: NOW, completedAt: NOW });

      expect(() => todo.complete(LATER)).toThrow("すでに完了しています");
      expect(todo.completedAt).toEqual(NOW);
    });
  });

  describe("reopen（元に戻す）", () => {
    it("完了していれば未完了に戻せる", () => {
      const todo = Todo.reconstruct({ id: "t1", title: "資料を読む", createdAt: NOW, completedAt: NOW });

      todo.reopen();

      expect(todo.isCompleted).toBe(false);
      expect(todo.completedAt).toBeNull();
    });

    it("まだ完了していなければ DomainError になる", () => {
      const todo = Todo.create({ title: "資料を読む" }, NOW);

      expect(() => todo.reopen()).toThrow("まだ完了していません");
    });
  });
});
