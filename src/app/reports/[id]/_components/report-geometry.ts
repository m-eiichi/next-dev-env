import type { ReportElementDto } from "@/server/application/dto/report/report.dto";

// エディタの計算（描く・動かす・大きさを変える）。長さの単位はすべて mm
// 用紙からはみ出さないように、ここで先に収める（最終的なルールのチェックはドメイン層）

export type Tool = "select" | "text" | "rect" | "line";
export type Point = { x: number; y: number };
export type Paper = { width: number; height: number };
// resize: テキスト・四角形の右下、start / end: 線の端
export type Handle = "resize" | "start" | "end";

export const PT_TO_MM = 0.3528;
const MIN_BOX_SIZE = 1;
// これより小さくドラッグしたら、クリックとみなして決まった大きさで置く
const CLICK_THRESHOLD = 2;
const DEFAULT_SIZE = {
  text: { width: 50, fontSize: 10 },
  rect: { width: 40, height: 20 },
  line: { length: 40 },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// step の倍数に合わせる。小数の誤差（0.30000000000000004 など）を残さない
export function snap(value: number, step: number): number {
  return Math.round(Math.round(value / step) * step * 100) / 100;
}

export function snapPoint(point: Point, step: number): Point {
  return { x: snap(point.x, step), y: snap(point.y, step) };
}

function textHeight(fontSize: number): number {
  return Math.ceil(fontSize * PT_TO_MM * 1.6);
}

// 選択の枠を出すための、部品を囲む四角形
export function getBounds(element: ReportElementDto): { x: number; y: number; width: number; height: number } {
  if (element.kind === "line") {
    return {
      x: Math.min(element.x1, element.x2),
      y: Math.min(element.y1, element.y2),
      width: Math.abs(element.x2 - element.x1),
      height: Math.abs(element.y2 - element.y1),
    };
  }
  return { x: element.x, y: element.y, width: element.width, height: element.height };
}

// 部品全体を動かす。用紙の端で止まる
export function moveElement(element: ReportElementDto, dx: number, dy: number, paper: Paper): ReportElementDto {
  const bounds = getBounds(element);
  const safeDx = clamp(dx, -bounds.x, paper.width - bounds.x - bounds.width);
  const safeDy = clamp(dy, -bounds.y, paper.height - bounds.y - bounds.height);
  if (element.kind === "line") {
    return {
      ...element,
      x1: element.x1 + safeDx,
      y1: element.y1 + safeDy,
      x2: element.x2 + safeDx,
      y2: element.y2 + safeDy,
    };
  }
  return { ...element, x: element.x + safeDx, y: element.y + safeDy };
}

// つまみ（右下、線の端）を point まで動かす
export function moveHandle(element: ReportElementDto, handle: Handle, point: Point, paper: Paper): ReportElementDto {
  if (element.kind === "line") {
    const x = clamp(point.x, 0, paper.width);
    const y = clamp(point.y, 0, paper.height);
    const next = handle === "start" ? { ...element, x1: x, y1: y } : { ...element, x2: x, y2: y };
    // 長さ 0 の線は作らない
    return next.x1 === next.x2 && next.y1 === next.y2 ? element : next;
  }
  return {
    ...element,
    width: clamp(point.x - element.x, MIN_BOX_SIZE, paper.width - element.x),
    height: clamp(point.y - element.y, MIN_BOX_SIZE, paper.height - element.y),
  };
}

// 数値の欄などで直接変えたあと、用紙に収める
export function fitToPaper(element: ReportElementDto, paper: Paper): ReportElementDto {
  if (element.kind === "line") {
    return {
      ...element,
      x1: clamp(element.x1, 0, paper.width),
      y1: clamp(element.y1, 0, paper.height),
      x2: clamp(element.x2, 0, paper.width),
      y2: clamp(element.y2, 0, paper.height),
    };
  }
  const width = clamp(element.width, MIN_BOX_SIZE, paper.width);
  const height = clamp(element.height, MIN_BOX_SIZE, paper.height);
  return {
    ...element,
    width,
    height,
    x: clamp(element.x, 0, paper.width - width),
    y: clamp(element.y, 0, paper.height - height),
  };
}

// ドラッグした 2 点（from → to）から、新しい部品を作る
export function createElement(tool: Exclude<Tool, "select">, from: Point, to: Point, paper: Paper, id: string): ReportElementDto {
  const isClick = Math.abs(to.x - from.x) < CLICK_THRESHOLD && Math.abs(to.y - from.y) < CLICK_THRESHOLD;

  if (tool === "line") {
    const end = isClick ? { x: from.x + DEFAULT_SIZE.line.length, y: from.y } : to;
    return fitToPaper({ kind: "line", id, x1: from.x, y1: from.y, x2: end.x, y2: end.y, strokeWidth: 0.3 }, paper);
  }

  const x = Math.min(from.x, to.x);
  const y = Math.min(from.y, to.y);
  if (tool === "text") {
    const fontSize = DEFAULT_SIZE.text.fontSize;
    return fitToPaper(
      {
        kind: "text",
        id,
        x,
        y,
        width: isClick ? DEFAULT_SIZE.text.width : Math.abs(to.x - from.x),
        height: isClick ? textHeight(fontSize) : Math.abs(to.y - from.y),
        text: "テキスト",
        fontSize,
        bold: false,
        align: "left",
      },
      paper,
    );
  }
  return fitToPaper(
    {
      kind: "rect",
      id,
      x,
      y,
      width: isClick ? DEFAULT_SIZE.rect.width : Math.abs(to.x - from.x),
      height: isClick ? DEFAULT_SIZE.rect.height : Math.abs(to.y - from.y),
      strokeWidth: 0.3,
      fill: "none",
    },
    paper,
  );
}

// 部品の ID。http の開発環境では crypto.randomUUID が使えないことがあるので、乱数で作る
export function createElementId(): string {
  return `el-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
