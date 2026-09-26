import "server-only";
import type { ReportElementProps } from "@/server/domain/report/value-objects/report-layout";

// DB が決まるまでの仮のデータ置き場。読み取り（Query Service）と更新（リポジトリ）が、この 1 つの配列を共有する
// サーバーを立ち上げ直すと、変更は消える（docs/03_画面設計/SCR-041_ドキュメントエディタ.md の「7.2」）

// DB の 1 行にあたる形。日時は ISO 8601 の文字列で持つ
export type ReportRow = {
  id: string;
  name: string;
  elements: ReportElementProps[];
  createdAt: string;
  updatedAt: string;
};

function text(
  id: string,
  x: number,
  y: number,
  width: number,
  value: string,
  options: { fontSize?: number; bold?: boolean; align?: "left" | "center" | "right" } = {},
): ReportElementProps {
  const fontSize = options.fontSize ?? 10;
  return {
    kind: "text",
    id,
    x,
    y,
    width,
    // 1pt ≒ 0.353mm。行の高さに少し余裕を持たせる
    height: Math.ceil(fontSize * 0.353 * 1.6),
    text: value,
    fontSize,
    bold: options.bold ?? false,
    align: options.align ?? "left",
  };
}

// 見本のドキュメント（請求書）。表は四角形と線を組み合わせて描く
const INVOICE_ELEMENTS: ReportElementProps[] = [
  text("title", 20, 20, 170, "請 求 書", { fontSize: 24, bold: true, align: "center" }),
  { kind: "line", id: "title-line", x1: 70, y1: 34, x2: 140, y2: 34, strokeWidth: 0.5 },
  text("to", 20, 45, 90, "{{宛先}} 御中", { fontSize: 14 }),
  { kind: "line", id: "to-line", x1: 20, y1: 53, x2: 110, y2: 53, strokeWidth: 0.3 },
  text("date", 130, 45, 60, "発行日: {{発行日}}", { align: "right" }),
  text("no", 130, 51, 60, "請求番号: {{請求番号}}", { align: "right" }),
  text("company", 130, 62, 60, "株式会社サンプル", { bold: true, align: "right" }),
  text("address", 130, 68, 60, "東京都千代田区 1-2-3", { fontSize: 9, align: "right" }),
  { kind: "rect", id: "total-box", x: 20, y: 80, width: 90, height: 14, strokeWidth: 0.5, fill: "none" },
  { kind: "rect", id: "total-label-bg", x: 20, y: 80, width: 35, height: 14, strokeWidth: 0.5, fill: "gray" },
  text("total-label", 20, 83, 35, "ご請求金額", { bold: true, align: "center" }),
  text("total", 57, 82, 50, "¥{{合計}}-", { fontSize: 14, bold: true, align: "right" }),
  { kind: "rect", id: "table", x: 20, y: 105, width: 170, height: 80, strokeWidth: 0.5, fill: "none" },
  { kind: "rect", id: "table-head", x: 20, y: 105, width: 170, height: 8, strokeWidth: 0.5, fill: "gray" },
  { kind: "line", id: "col-1", x1: 110, y1: 105, x2: 110, y2: 185, strokeWidth: 0.3 },
  { kind: "line", id: "col-2", x1: 130, y1: 105, x2: 130, y2: 185, strokeWidth: 0.3 },
  { kind: "line", id: "col-3", x1: 155, y1: 105, x2: 155, y2: 185, strokeWidth: 0.3 },
  text("head-item", 20, 106, 90, "品目", { bold: true, align: "center" }),
  text("head-qty", 110, 106, 20, "数量", { bold: true, align: "center" }),
  text("head-price", 130, 106, 25, "単価", { bold: true, align: "center" }),
  text("head-amount", 155, 106, 35, "金額", { bold: true, align: "center" }),
  ...[121, 129, 137, 145, 153, 161, 169, 177].map(
    (y, index): ReportElementProps => ({
      kind: "line",
      id: `row-${index + 1}`,
      x1: 20,
      y1: y,
      x2: 190,
      y2: y,
      strokeWidth: 0.1,
    }),
  ),
  text("note-label", 20, 195, 30, "備考", { bold: true }),
  { kind: "rect", id: "note-box", x: 20, y: 202, width: 170, height: 30, strokeWidth: 0.3, fill: "none" },
];

// 更新したのが新しいものほど先頭に置く
export const reportRows: ReportRow[] = [
  {
    id: "report-1",
    name: "請求書（見本）",
    elements: INVOICE_ELEMENTS,
    createdAt: "2026-09-26T01:00:00.000Z",
    updatedAt: "2026-09-26T01:00:00.000Z",
  },
];
