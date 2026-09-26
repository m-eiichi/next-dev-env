"use client";

import {
  Minus,
  MousePointer2,
  Printer,
  Save,
  Square,
  Type,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, useTransition, type KeyboardEvent } from "react";
import { Button } from "@/components/atoms/button";
import type {
  ReportDto,
  ReportElementDto,
} from "@/server/application/dto/report/report.dto";
import { saveReportLayout } from "@/server/entry/actions/report/save-report-layout";
import { ReportCanvas } from "./report-canvas";
import {
  createElementId,
  fitToPaper,
  moveElement,
  type Tool,
} from "./report-geometry";
import { ReportPropertyPanel } from "./report-property-panel";

const TOOLS: {
  tool: Tool;
  label: string;
  shortcut: string;
  icon: LucideIcon;
}[] = [
  { tool: "select", label: "選択", shortcut: "V", icon: MousePointer2 },
  { tool: "text", label: "テキスト", shortcut: "T", icon: Type },
  { tool: "rect", label: "四角形", shortcut: "R", icon: Square },
  { tool: "line", label: "線", shortcut: "L", icon: Minus },
];
const TOOL_BY_KEY: Record<string, Tool> = {
  v: "select",
  t: "text",
  r: "rect",
  l: "line",
};
const MAX_HISTORY = 50;

// ドキュメントエディタ本体（docs/03_画面設計/SCR-041_ドキュメントエディタ.md）
// 保存するまでは、部品の並びをこの部品の state だけで持つ
export function ReportEditor({ report }: { report: ReportDto }) {
  const { paper } = report;
  const [elements, setElements] = useState(report.elements);
  const [savedJson, setSavedJson] = useState(() =>
    JSON.stringify(report.elements),
  );
  // 元に戻すための、変える前の部品の並び
  const [history, setHistory] = useState<ReportElementDto[][]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const selected =
    elements.find((element) => element.id === selectedId) ?? null;
  const isDirty = JSON.stringify(elements) !== savedJson;
  const snapStep = snapToGrid ? 5 : 0.5;

  // 保存していない変更があるときは、ページを離れる前にブラウザに確かめさせる
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) =>
      event.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const pushHistory = () => {
    setHistory((prev) => [...prev.slice(-(MAX_HISTORY - 1)), elements]);
    setMessage(null);
  };

  // 履歴を積んでから、部品の並びを置き換える
  const commit = (next: ReportElementDto[]) => {
    pushHistory();
    setElements(next);
  };

  // ドラッグ中・入力中の細かい変更。履歴は動かし始め（入り始め）に 1 回だけ積む
  const updateElement = (element: ReportElementDto) => {
    setElements((prev) =>
      prev.map((item) => (item.id === element.id ? element : item)),
    );
  };

  const handleUndo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setHistory(history.slice(0, -1));
    setElements(previous);
    if (!previous.some((element) => element.id === selectedId)) {
      setSelectedId(null);
    }
  };

  const handleCreate = (element: ReportElementDto) => {
    commit([...elements, element]);
    setSelectedId(element.id);
    setTool("select");
  };

  const handleDelete = () => {
    if (!selected) return;
    commit(elements.filter((element) => element.id !== selected.id));
    setSelectedId(null);
  };

  const handleDuplicate = () => {
    if (!selected) return;
    const copy = moveElement(
      { ...selected, id: createElementId() },
      5,
      5,
      paper,
    );
    commit([...elements, copy]);
    setSelectedId(copy.id);
  };

  // 配列の後ろほど前面に描かれる
  const handleBringToFront = () => {
    if (!selected) return;
    commit([
      ...elements.filter((element) => element.id !== selected.id),
      selected,
    ]);
  };

  const handleSendToBack = () => {
    if (!selected) return;
    commit([
      selected,
      ...elements.filter((element) => element.id !== selected.id),
    ]);
  };

  const handleKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    const isModifier = event.ctrlKey || event.metaKey;
    const key = event.key.toLowerCase();

    if (isModifier && key === "z") {
      event.preventDefault();
      handleUndo();
      return;
    }
    if (isModifier && key === "d") {
      event.preventDefault();
      handleDuplicate();
      return;
    }
    if (isModifier) return;

    if (Object.hasOwn(TOOL_BY_KEY, key)) {
      setTool(TOOL_BY_KEY[key]);
      return;
    }
    if (key === "escape") {
      setSelectedId(null);
      setTool("select");
      return;
    }
    if (!selected) return;
    if (key === "delete" || key === "backspace") {
      event.preventDefault();
      handleDelete();
      return;
    }
    const distance = event.shiftKey ? 5 : 1;
    const moves: Record<string, [number, number]> = {
      arrowleft: [-distance, 0],
      arrowright: [distance, 0],
      arrowup: [0, -distance],
      arrowdown: [0, distance],
    };
    if (Object.hasOwn(moves, key)) {
      event.preventDefault();
      const [dx, dy] = moves[key];
      const moved = moveElement(selected, dx, dy, paper);
      commit(
        elements.map((element) => (element.id === moved.id ? moved : element)),
      );
    }
  };

  const handleSave = () => {
    const snapshot = elements;
    setMessage(null);
    startTransition(async () => {
      const result = await saveReportLayout({
        id: report.id,
        elements: snapshot,
      });
      if (result.ok) {
        setSavedJson(JSON.stringify(snapshot));
        setMessage({ ok: true, text: "保存しました" });
      } else {
        setMessage({ ok: false, text: result.message });
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        role="toolbar"
        aria-label="道具"
        className="flex flex-wrap items-center gap-2 print:hidden"
      >
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {TOOLS.map(({ tool: value, label, shortcut, icon: Icon }) => (
            <Button
              key={value}
              variant={tool === value ? "default" : "ghost"}
              size="sm"
              aria-pressed={tool === value}
              title={`${label}（${shortcut}）`}
              onClick={() => setTool(value)}
            >
              <Icon aria-hidden="true" />
              {label}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          disabled={history.length === 0}
          title="元に戻す（Ctrl+Z）"
        >
          <Undo2 aria-hidden="true" />
          元に戻す
        </Button>
        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={snapToGrid}
            onChange={(event) => setSnapToGrid(event.target.checked)}
            className="size-4 accent-primary"
          />
          5mm に吸着
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(event) => setShowGrid(event.target.checked)}
            className="size-4 accent-primary"
          />
          方眼
        </label>
        <div className="ml-auto flex items-center gap-2">
          {isDirty && (
            <span className="text-sm text-muted-foreground">
              未保存の変更があります
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer aria-hidden="true" />
            印刷
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isPending || !isDirty}
          >
            <Save aria-hidden="true" />
            {isPending ? "保存中…" : "保存"}
          </Button>
        </div>
      </div>

      {message && (
        <p
          role={message.ok ? "status" : "alert"}
          className={`text-sm print:hidden ${message.ok ? "text-muted-foreground" : "text-destructive"}`}
        >
          {message.text}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-lg bg-muted p-4 print:rounded-none print:bg-transparent print:p-0">
          <div className="mx-auto max-w-[794px] print:max-w-none">
            <ReportCanvas
              paper={paper}
              elements={elements}
              selectedId={selectedId}
              tool={tool}
              snapStep={snapStep}
              showGrid={showGrid}
              onSelect={setSelectedId}
              onEditStart={pushHistory}
              onChange={updateElement}
              onCreate={handleCreate}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <aside aria-label="部品の設定" className="print:hidden">
          <ReportPropertyPanel
            key={selected?.id}
            element={selected}
            onEditStart={pushHistory}
            onChange={(element) => updateElement(fitToPaper(element, paper))}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
          />
        </aside>
      </div>
    </div>
  );
}
