import type { ReportElementDto } from "@/server/application/dto/report/report.dto";
import { PT_TO_MM } from "./report-geometry";

const TEXT_ANCHOR = { left: "start", center: "middle", right: "end" } as const;

// 部品を 1 つ、SVG で描く（座標は mm）。用紙は画面の色に関係なく白、部品は黒で描く
export function ReportShape({ element }: { element: ReportElementDto }) {
  if (element.kind === "line") {
    return (
      <line
        x1={element.x1}
        y1={element.y1}
        x2={element.x2}
        y2={element.y2}
        strokeWidth={element.strokeWidth}
        strokeLinecap="square"
        className="stroke-black"
      />
    );
  }

  if (element.kind === "rect") {
    return (
      <rect
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        strokeWidth={element.strokeWidth}
        className={element.fill === "gray" ? "fill-zinc-200 stroke-black" : "fill-transparent stroke-black"}
      />
    );
  }

  const textX =
    element.align === "left" ? element.x + 0.5 : element.align === "right" ? element.x + element.width - 0.5 : element.x + element.width / 2;
  return (
    <text
      x={textX}
      y={element.y + element.height / 2}
      fontSize={element.fontSize * PT_TO_MM}
      fontWeight={element.bold ? 700 : 400}
      textAnchor={TEXT_ANCHOR[element.align]}
      dominantBaseline="central"
      className="fill-black"
    >
      {element.text}
    </text>
  );
}
