import { describe, expect, it } from "vitest";
import type { ReportElementDto } from "@/server/application/dto/report/report.dto";
import { createElement, fitToPaper, moveElement, moveHandle, snap } from "./report-geometry";

const PAPER = { width: 210, height: 297 };
const RECT: ReportElementDto = { kind: "rect", id: "r", x: 10, y: 10, width: 40, height: 20, strokeWidth: 0.3, fill: "none" };
const LINE: ReportElementDto = { kind: "line", id: "l", x1: 10, y1: 10, x2: 50, y2: 10, strokeWidth: 0.3 };

describe("snap", () => {
  it("step の倍数に合わせ、小数の誤差を残さない", () => {
    expect(snap(12.4, 5)).toBe(10);
    expect(snap(12.6, 5)).toBe(15);
    expect(snap(0.1 + 0.2, 0.5)).toBe(0.5);
  });
});

describe("moveElement", () => {
  it("用紙の端で止まる", () => {
    expect(moveElement(RECT, -100, 500, PAPER)).toMatchObject({ x: 0, y: 277 });
  });

  it("線は 2 点を同じだけ動かす", () => {
    expect(moveElement(LINE, 5, 5, PAPER)).toMatchObject({ x1: 15, y1: 15, x2: 55, y2: 15 });
  });
});

describe("moveHandle", () => {
  it("右下のつまみで大きさを変える。1mm より小さくならず、用紙の端を越えない", () => {
    expect(moveHandle(RECT, "resize", { x: 5, y: 5 }, PAPER)).toMatchObject({ width: 1, height: 1 });
    expect(moveHandle(RECT, "resize", { x: 300, y: 400 }, PAPER)).toMatchObject({ width: 200, height: 287 });
  });

  it("線の端を動かす。長さ 0 になるなら動かさない", () => {
    expect(moveHandle(LINE, "end", { x: 50, y: 60 }, PAPER)).toMatchObject({ x2: 50, y2: 60 });
    expect(moveHandle(LINE, "start", { x: 50, y: 10 }, PAPER)).toBe(LINE);
  });
});

describe("fitToPaper", () => {
  it("はみ出した部品を用紙に収める", () => {
    expect(fitToPaper({ ...RECT, x: 200, width: 40 }, PAPER)).toMatchObject({ x: 170, width: 40 });
  });
});

describe("createElement", () => {
  it("ドラッグした範囲で四角形を作る（逆向きのドラッグでもよい）", () => {
    expect(createElement("rect", { x: 50, y: 60 }, { x: 10, y: 20 }, PAPER, "n")).toMatchObject({
      x: 10,
      y: 20,
      width: 40,
      height: 40,
    });
  });

  it("クリックだけなら、決まった大きさで置く", () => {
    expect(createElement("text", { x: 10, y: 10 }, { x: 10, y: 10 }, PAPER, "n")).toMatchObject({
      kind: "text",
      width: 50,
      text: "テキスト",
    });
    expect(createElement("line", { x: 10, y: 10 }, { x: 11, y: 10 }, PAPER, "n")).toMatchObject({ x2: 50, y2: 10 });
  });

  it("用紙の端でクリックしても、はみ出さない", () => {
    expect(createElement("rect", { x: 205, y: 290 }, { x: 205, y: 290 }, PAPER, "n")).toMatchObject({
      x: 170,
      y: 277,
    });
  });
});
