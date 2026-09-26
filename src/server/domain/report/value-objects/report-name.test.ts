import { describe, expect, it } from "vitest";
import { ReportName } from "./report-name";
import { DomainError } from "../../shared/domain-error";

describe("ReportName", () => {
  it("前後の空白を取り除く", () => {
    expect(ReportName.of("  請求書  ").value).toBe("請求書");
  });

  it("空（空白だけ）だと DomainError になる", () => {
    expect(() => ReportName.of("   ")).toThrow(DomainError);
  });

  it("50 文字までは作れ、51 文字だと DomainError になる", () => {
    expect(ReportName.of("あ".repeat(50)).value).toHaveLength(50);
    expect(() => ReportName.of("あ".repeat(51))).toThrow("50 文字以内");
  });
});
