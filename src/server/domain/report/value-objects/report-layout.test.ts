import { describe, expect, it } from "vitest";
import { MAX_ELEMENTS, ReportLayout, type ReportElementProps } from "./report-layout";
import { DomainError } from "../../shared/domain-error";

const TEXT: ReportElementProps = {
  kind: "text",
  id: "e1",
  x: 10,
  y: 10,
  width: 60,
  height: 8,
  text: "請求書",
  fontSize: 12,
  bold: false,
  align: "left",
};
const RECT: ReportElementProps = { kind: "rect", id: "e2", x: 0, y: 0, width: 210, height: 297, strokeWidth: 0.3, fill: "none" };
const LINE: ReportElementProps = { kind: "line", id: "e3", x1: 10, y1: 20, x2: 200, y2: 20, strokeWidth: 0.3 };

describe("ReportLayout", () => {
  it("用紙に収まる部品なら作れる（用紙の端ちょうども可）", () => {
    const layout = ReportLayout.of([TEXT, RECT, LINE]);

    expect(layout.elements).toEqual([TEXT, RECT, LINE]);
  });

  it("取り出した部品を書き換えても、中身は変わらない", () => {
    const layout = ReportLayout.of([TEXT]);

    layout.elements[0].id = "changed";

    expect(layout.elements[0].id).toBe("e1");
  });

  it(`部品が ${MAX_ELEMENTS} 個を超えると DomainError になる`, () => {
    const elements = Array.from({ length: MAX_ELEMENTS + 1 }, (_, index) => ({ ...LINE, id: `l${index}` }));

    expect(() => ReportLayout.of(elements.slice(0, MAX_ELEMENTS))).not.toThrow();
    expect(() => ReportLayout.of(elements)).toThrow(`部品は ${MAX_ELEMENTS} 個までにしてください`);
  });

  it("ID が重なると DomainError になる", () => {
    expect(() => ReportLayout.of([TEXT, { ...RECT, id: "e1" }])).toThrow("部品の ID が重なっています");
  });

  describe("テキスト・四角形", () => {
    it("用紙からはみ出すと DomainError になる", () => {
      expect(() => ReportLayout.of([{ ...RECT, width: 210.5 }])).toThrow("部品が用紙からはみ出しています");
      expect(() => ReportLayout.of([{ ...TEXT, x: -1 }])).toThrow(DomainError);
    });

    it("幅・高さが 1mm より小さいと DomainError になる", () => {
      expect(() => ReportLayout.of([{ ...RECT, height: 0.5 }])).toThrow("1mm 以上");
    });

    it("線の太さが範囲外だと DomainError になる", () => {
      expect(() => ReportLayout.of([{ ...RECT, strokeWidth: 3.1 }])).toThrow("線の太さ");
    });

    it("テキストが 200 文字を超えると DomainError になる", () => {
      expect(() => ReportLayout.of([{ ...TEXT, text: "あ".repeat(200) }])).not.toThrow();
      expect(() => ReportLayout.of([{ ...TEXT, text: "あ".repeat(201) }])).toThrow("200 文字以内");
    });

    it("文字の大きさが 6〜72pt でなければ DomainError になる", () => {
      expect(() => ReportLayout.of([{ ...TEXT, fontSize: 6 }])).not.toThrow();
      expect(() => ReportLayout.of([{ ...TEXT, fontSize: 5 }])).toThrow("文字の大きさ");
      expect(() => ReportLayout.of([{ ...TEXT, fontSize: 73 }])).toThrow("文字の大きさ");
    });
  });

  describe("線", () => {
    it("端が用紙からはみ出すと DomainError になる", () => {
      expect(() => ReportLayout.of([{ ...LINE, y2: 298 }])).toThrow("線が用紙からはみ出しています");
    });

    it("長さが 0 だと DomainError になる", () => {
      expect(() => ReportLayout.of([{ ...LINE, x2: 10, y2: 20 }])).toThrow("線の長さが 0 です");
    });

    it("線の太さが範囲外だと DomainError になる", () => {
      expect(() => ReportLayout.of([{ ...LINE, strokeWidth: 0 }])).toThrow("線の太さ");
    });
  });
});
