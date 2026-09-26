import { describe, expect, it } from "vitest";
import { NoteTitle } from "./note-title";
import { DomainError } from "../../shared/domain-error";

describe("NoteTitle", () => {
  it("前後の空白を取り除いて保持する", () => {
    expect(NoteTitle.of("  タイトル  ").value).toBe("タイトル");
  });

  it("100 文字ちょうどなら作れる", () => {
    expect(NoteTitle.of("あ".repeat(100)).value).toHaveLength(100);
  });

  it("100 文字を超えると DomainError になる", () => {
    expect(() => NoteTitle.of("あ".repeat(101))).toThrow(DomainError);
  });

  it("空白だけだと DomainError になる", () => {
    expect(() => NoteTitle.of("   ")).toThrow("タイトルは必須です");
  });
});
