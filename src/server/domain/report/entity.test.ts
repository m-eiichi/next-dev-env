import { describe, expect, it } from "vitest";
import { Report } from "./entity";
import { DomainError } from "../shared/domain-error";
import type { ReportElementProps } from "./value-objects/report-layout";

const NOW = new Date("2026-09-26T09:00:00Z");
const LATER = new Date("2026-09-26T10:00:00Z");
const LINE: ReportElementProps = { kind: "line", id: "l1", x1: 10, y1: 20, x2: 200, y2: 20, strokeWidth: 0.3 };

describe("Report", () => {
  describe("create（新しく作る）", () => {
    it("部品なしの白紙で作る。作った日時と更新した日時は同じ", () => {
      const report = Report.create({ name: "  請求書  " }, NOW);

      expect(report.id).not.toBe("");
      expect(report.name.value).toBe("請求書");
      expect(report.elements).toEqual([]);
      expect(report.createdAt).toEqual(NOW);
      expect(report.updatedAt).toEqual(NOW);
    });

    it("名前がルールに合わなければ DomainError になる", () => {
      expect(() => Report.create({ name: "" }, NOW)).toThrow(DomainError);
    });
  });

  describe("replaceLayout（レイアウトを置き換える）", () => {
    it("部品を置き換え、更新した日時を変える", () => {
      const report = Report.create({ name: "請求書" }, NOW);

      report.replaceLayout([LINE], LATER);

      expect(report.elements).toEqual([LINE]);
      expect(report.updatedAt).toEqual(LATER);
    });

    it("ルールに合わなければ DomainError になり、元のレイアウトと更新日時のまま残る", () => {
      const report = Report.reconstruct({ id: "r1", name: "請求書", elements: [LINE], createdAt: NOW, updatedAt: NOW });

      expect(() => report.replaceLayout([{ ...LINE, x2: 300 }], LATER)).toThrow("はみ出しています");
      expect(report.elements).toEqual([LINE]);
      expect(report.updatedAt).toEqual(NOW);
    });
  });
});
