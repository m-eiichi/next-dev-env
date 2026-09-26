import { describe, expect, it } from "vitest";
import { TodoTitle } from "./todo-title";
import { DomainError } from "../../shared/domain-error";

describe("TodoTitle", () => {
  it("前後の空白を取り除いて保持する", () => {
    expect(TodoTitle.of("  資料を読む  ").value).toBe("資料を読む");
  });

  it("100 文字ちょうどなら作れる", () => {
    expect(TodoTitle.of("あ".repeat(100)).value).toHaveLength(100);
  });

  it("100 文字を超えると DomainError になる", () => {
    expect(() => TodoTitle.of("あ".repeat(101))).toThrow(DomainError);
  });

  it("空白だけだと DomainError になる", () => {
    expect(() => TodoTitle.of("   ")).toThrow("タイトルは必須です");
  });
});
