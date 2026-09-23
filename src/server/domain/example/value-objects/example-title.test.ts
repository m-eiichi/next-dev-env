import { describe, expect, it } from "vitest";
import { ExampleTitle } from "./example-title";
import { DomainError } from "../../shared/domain-error";

describe("ExampleTitle", () => {
  it("前後の空白を取り除いて保持する", () => {
    expect(ExampleTitle.of("  タイトル  ").value).toBe("タイトル");
  });

  it("100 文字ちょうどなら作れる", () => {
    expect(ExampleTitle.of("あ".repeat(100)).value).toHaveLength(100);
  });

  it("100 文字を超えると DomainError になる", () => {
    expect(() => ExampleTitle.of("あ".repeat(101))).toThrow(DomainError);
  });

  it("空白だけだと DomainError になる", () => {
    expect(() => ExampleTitle.of("   ")).toThrow("タイトルは必須です");
  });
});
