import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ReportElementDto } from "@/server/application/dto/report/report.dto";
import {
  createElement,
  createElementId,
  getBounds,
  moveElement,
  moveHandle,
  snap,
  snapPoint,
  type Handle,
  type Paper,
  type Point,
  type Tool,
} from "./report-geometry";
import { ReportShape } from "./report-shape";

type Drag =
  | { type: "draw"; tool: Exclude<Tool, "select">; from: Point; to: Point }
  | { type: "move"; from: Point; initial: ReportElementDto }
  | { type: "handle"; handle: Handle; initial: ReportElementDto };

type Props = {
  paper: Paper;
  elements: ReportElementDto[];
  selectedId: string | null;
  tool: Tool;
  snapStep: number;
  showGrid: boolean;
  onSelect: (id: string | null) => void;
  // ドラッグで最初に動いたとき（元に戻すための履歴を 1 つ積む）
  onEditStart: () => void;
  onChange: (element: ReportElementDto) => void;
  onCreate: (element: ReportElementDto) => void;
  onKeyDown: (event: KeyboardEvent<SVGSVGElement>) => void;
};

const HANDLE_SIZE = 2.5; // mm
const GRID_SIZE = 10; // mm

// 画面上の位置（px）を、用紙の上の位置（mm）に直す
function toPaperPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const matrix = svg.getScreenCTM();
  if (!matrix) {
    return { x: 0, y: 0 };
  }
  const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
  return { x: point.x, y: point.y };
}

// 描く・選ぶ・動かす・大きさを変える（docs/03_画面設計/SCR-041_ドキュメントエディタ.md の「6」）
export function ReportCanvas({
  paper,
  elements,
  selectedId,
  tool,
  snapStep,
  showGrid,
  onSelect,
  onEditStart,
  onChange,
  onCreate,
  onKeyDown,
}: Props) {
  const [drag, setDrag] = useState<Drag | null>(null);
  // 動かし始めたかどうか。クリックしただけのときは履歴を積まない
  const hasMovedRef = useRef(false);
  const selected = elements.find((element) => element.id === selectedId) ?? null;

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    const svg = event.currentTarget;
    svg.focus();
    svg.setPointerCapture(event.pointerId);
    hasMovedRef.current = false;
    const point = toPaperPoint(svg, event.clientX, event.clientY);

    if (tool !== "select") {
      const from = snapPoint(point, snapStep);
      setDrag({ type: "draw", tool, from, to: from });
      return;
    }

    const target = event.target as Element;
    const handle = target.closest("[data-handle]")?.getAttribute("data-handle") as Handle | undefined;
    if (handle && selected) {
      setDrag({ type: "handle", handle, initial: selected });
      return;
    }

    const id = target.closest("[data-element-id]")?.getAttribute("data-element-id");
    const element = elements.find((item) => item.id === id);
    if (element) {
      onSelect(element.id);
      setDrag({ type: "move", from: point, initial: element });
      return;
    }

    onSelect(null);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const point = toPaperPoint(event.currentTarget, event.clientX, event.clientY);

    if (drag.type === "draw") {
      setDrag({ ...drag, to: snapPoint(point, snapStep) });
      return;
    }

    if (!hasMovedRef.current) {
      hasMovedRef.current = true;
      onEditStart();
    }
    if (drag.type === "move") {
      const dx = snap(point.x - drag.from.x, snapStep);
      const dy = snap(point.y - drag.from.y, snapStep);
      onChange(moveElement(drag.initial, dx, dy, paper));
    } else {
      onChange(moveHandle(drag.initial, drag.handle, snapPoint(point, snapStep), paper));
    }
  };

  const handlePointerUp = () => {
    if (drag?.type === "draw") {
      onCreate(createElement(drag.tool, drag.from, drag.to, paper, createElementId()));
    }
    setDrag(null);
  };

  const draft = drag?.type === "draw" ? createElement(drag.tool, drag.from, drag.to, paper, "draft") : null;

  return (
    <svg
      viewBox={`0 0 ${paper.width} ${paper.height}`}
      tabIndex={0}
      role="application"
      aria-label="ドキュメントの用紙（A4）。Delete で削除、矢印キーで移動、Ctrl+Z で元に戻す、Ctrl+D で複製"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={onKeyDown}
      className={`block h-auto w-full touch-none bg-white shadow-md ring-1 ring-border outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 print:h-[297mm] print:w-[210mm] print:shadow-none print:ring-0 ${tool === "select" ? "cursor-default" : "cursor-crosshair"}`}
    >
      {showGrid && (
        <g className="print:hidden">
          <defs>
            <pattern id="report-grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
              <path
                d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                fill="none"
                vectorEffect="non-scaling-stroke"
                className="stroke-zinc-200"
              />
            </pattern>
          </defs>
          <rect width={paper.width} height={paper.height} fill="url(#report-grid)" />
        </g>
      )}

      {elements.map((element) => {
        const bounds = getBounds(element);
        return (
          <g key={element.id} data-element-id={element.id} className={tool === "select" ? "cursor-move" : undefined}>
            <ReportShape element={element} />
            {/* つかみやすいよう、見えない当たり判定を重ねる（細い線でも選べるように太くする） */}
            {element.kind === "line" ? (
              <line
                x1={element.x1}
                y1={element.y1}
                x2={element.x2}
                y2={element.y2}
                strokeWidth={3}
                className="stroke-transparent print:hidden"
              />
            ) : (
              <rect {...bounds} className="fill-transparent print:hidden" />
            )}
          </g>
        );
      })}

      {draft && (
        <g className="pointer-events-none opacity-60">
          <ReportShape element={draft} />
        </g>
      )}

      {selected && <SelectionOverlay element={selected} />}
    </svg>
  );
}

function SelectionOverlay({ element }: { element: ReportElementDto }) {
  const bounds = getBounds(element);
  const handles =
    element.kind === "line"
      ? [
          { handle: "start", x: element.x1, y: element.y1 },
          { handle: "end", x: element.x2, y: element.y2 },
        ]
      : [{ handle: "resize", x: element.x + element.width, y: element.y + element.height }];

  return (
    <g className="print:hidden">
      <rect
        x={bounds.x - 0.5}
        y={bounds.y - 0.5}
        width={bounds.width + 1}
        height={bounds.height + 1}
        fill="none"
        strokeDasharray="4 3"
        vectorEffect="non-scaling-stroke"
        className="pointer-events-none stroke-primary"
      />
      {handles.map(({ handle, x, y }) => (
        <rect
          key={handle}
          data-handle={handle}
          x={x - HANDLE_SIZE / 2}
          y={y - HANDLE_SIZE / 2}
          width={HANDLE_SIZE}
          height={HANDLE_SIZE}
          vectorEffect="non-scaling-stroke"
          className={`fill-white stroke-primary ${handle === "resize" ? "cursor-nwse-resize" : "cursor-crosshair"}`}
        />
      ))}
    </g>
  );
}
