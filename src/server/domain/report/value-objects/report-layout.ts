import { DomainError } from "../../shared/domain-error";

// 用紙。長さの単位はすべて mm（docs/03_画面設計/SCR-041_ドキュメントエディタ.md の「5.1」）
export const PAPER_A4 = { width: 210, height: 297 } as const;

export const MAX_ELEMENTS = 200;
const MAX_TEXT_LENGTH = 200;
const MIN_BOX_SIZE = 1;
const FONT_SIZE_RANGE = { min: 6, max: 72 } as const; // pt
const STROKE_WIDTH_RANGE = { min: 0.1, max: 3 } as const; // mm

// ドキュメントに置く部品。テキストと四角形は枠（x, y, width, height）、線は 2 点で持つ
export type ReportElementProps =
  | {
      kind: "text";
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      text: string;
      fontSize: number;
      bold: boolean;
      align: "left" | "center" | "right";
    }
  | {
      kind: "rect";
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      strokeWidth: number;
      fill: "none" | "gray";
    }
  | {
      kind: "line";
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      strokeWidth: number;
    };

// 部品の並び（後ろほど前面）。用紙からはみ出さないことなどのルールを守る
export class ReportLayout {
  private constructor(private readonly _elements: readonly ReportElementProps[]) {}

  static empty(): ReportLayout {
    return new ReportLayout([]);
  }

  static of(elements: readonly ReportElementProps[]): ReportLayout {
    if (elements.length > MAX_ELEMENTS) {
      throw new DomainError(`部品は ${MAX_ELEMENTS} 個までにしてください`);
    }
    const ids = new Set(elements.map((element) => element.id));
    if (ids.size !== elements.length) {
      throw new DomainError("部品の ID が重なっています");
    }
    elements.forEach(validateElement);
    return new ReportLayout(elements.map((element) => ({ ...element })));
  }

  // 外から書き換えられないよう、コピーして返す
  get elements(): ReportElementProps[] {
    return this._elements.map((element) => ({ ...element }));
  }
}

function validateElement(element: ReportElementProps): void {
  if (element.kind === "line") {
    if (!isInsidePaper(element.x1, element.y1) || !isInsidePaper(element.x2, element.y2)) {
      throw new DomainError("線が用紙からはみ出しています");
    }
    if (element.x1 === element.x2 && element.y1 === element.y2) {
      throw new DomainError("線の長さが 0 です");
    }
    validateStrokeWidth(element.strokeWidth);
    return;
  }

  if (element.width < MIN_BOX_SIZE || element.height < MIN_BOX_SIZE) {
    throw new DomainError(`部品の幅と高さは ${MIN_BOX_SIZE}mm 以上にしてください`);
  }
  if (!isInsidePaper(element.x, element.y) || !isInsidePaper(element.x + element.width, element.y + element.height)) {
    throw new DomainError("部品が用紙からはみ出しています");
  }

  if (element.kind === "rect") {
    validateStrokeWidth(element.strokeWidth);
    return;
  }

  if (element.text.length > MAX_TEXT_LENGTH) {
    throw new DomainError(`テキストは ${MAX_TEXT_LENGTH} 文字以内にしてください`);
  }
  if (element.fontSize < FONT_SIZE_RANGE.min || element.fontSize > FONT_SIZE_RANGE.max) {
    throw new DomainError(`文字の大きさは ${FONT_SIZE_RANGE.min}〜${FONT_SIZE_RANGE.max}pt にしてください`);
  }
}

function validateStrokeWidth(value: number): void {
  if (value < STROKE_WIDTH_RANGE.min || value > STROKE_WIDTH_RANGE.max) {
    throw new DomainError(`線の太さは ${STROKE_WIDTH_RANGE.min}〜${STROKE_WIDTH_RANGE.max}mm にしてください`);
  }
}

function isInsidePaper(x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x <= PAPER_A4.width && y <= PAPER_A4.height;
}
