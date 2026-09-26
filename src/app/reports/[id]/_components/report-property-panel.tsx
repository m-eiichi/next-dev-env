import { BringToFront, Copy, SendToBack, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import type { ReportElementDto } from "@/server/application/dto/report/report.dto";

type Props = {
  element: ReportElementDto | null;
  // 欄に入ったとき（元に戻すための履歴を 1 つ積む）
  onEditStart: () => void;
  onChange: (element: ReportElementDto) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
};

const KIND_LABEL = { text: "テキスト", rect: "四角形", line: "線" } as const;

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

function NumberField({
  label,
  value,
  step = 0.5,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label}>
      <Input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(event) => {
          // 入力の途中（空欄など）は反映しない
          const next = event.target.valueAsNumber;
          if (Number.isFinite(next)) onChange(next);
        }}
      />
    </Field>
  );
}

// 選んだ部品の位置・大きさ・中身を、数値や文字で変える
export function ReportPropertyPanel({
  element,
  onEditStart,
  onChange,
  onDelete,
  onDuplicate,
  onBringToFront,
  onSendToBack,
}: Props) {
  if (!element) {
    return (
      <p className="text-sm text-muted-foreground">
        部品を選ぶと、ここで位置や文字を変えられます。左上の道具を選んで用紙の上をドラッグすると、部品を描けます。
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold">{KIND_LABEL[element.kind]}</h2>
      <div className="flex flex-col gap-4" onFocusCapture={onEditStart}>

      {element.kind === "text" && (
        <>
          <Field label="文字（{{項目名}} で差し込み項目の目印にできます）">
            <textarea
              value={element.text}
              maxLength={200}
              rows={3}
              onChange={(event) => onChange({ ...element, text: event.target.value })}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label="大きさ（pt）"
              value={element.fontSize}
              step={1}
              min={6}
              max={72}
              onChange={(fontSize) => onChange({ ...element, fontSize })}
            />
            <Field label="揃え">
              <select
                value={element.align}
                onChange={(event) => onChange({ ...element, align: event.target.value as typeof element.align })}
                className={selectClassName}
              >
                <option value="left">左</option>
                <option value="center">中央</option>
                <option value="right">右</option>
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={element.bold}
              onChange={(event) => onChange({ ...element, bold: event.target.checked })}
              className="size-4 accent-primary"
            />
            太字
          </label>
        </>
      )}

      {element.kind === "line" ? (
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="始点 X（mm）" value={element.x1} onChange={(x1) => onChange({ ...element, x1 })} />
          <NumberField label="始点 Y（mm）" value={element.y1} onChange={(y1) => onChange({ ...element, y1 })} />
          <NumberField label="終点 X（mm）" value={element.x2} onChange={(x2) => onChange({ ...element, x2 })} />
          <NumberField label="終点 Y（mm）" value={element.y2} onChange={(y2) => onChange({ ...element, y2 })} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X（mm）" value={element.x} onChange={(x) => onChange({ ...element, x })} />
          <NumberField label="Y（mm）" value={element.y} onChange={(y) => onChange({ ...element, y })} />
          <NumberField label="幅（mm）" value={element.width} min={1} onChange={(width) => onChange({ ...element, width })} />
          <NumberField label="高さ（mm）" value={element.height} min={1} onChange={(height) => onChange({ ...element, height })} />
        </div>
      )}

      {element.kind !== "text" && (
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="線の太さ（mm）"
            value={element.strokeWidth}
            step={0.1}
            min={0.1}
            max={3}
            onChange={(strokeWidth) => onChange({ ...element, strokeWidth })}
          />
          {element.kind === "rect" && (
            <Field label="塗り">
              <select
                value={element.fill}
                onChange={(event) => onChange({ ...element, fill: event.target.value as typeof element.fill })}
                className={selectClassName}
              >
                <option value="none">なし</option>
                <option value="gray">灰色</option>
              </select>
            </Field>
          )}
        </div>
      )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onBringToFront}>
          <BringToFront aria-hidden="true" />
          前面へ
        </Button>
        <Button variant="outline" size="sm" onClick={onSendToBack}>
          <SendToBack aria-hidden="true" />
          背面へ
        </Button>
        <Button variant="outline" size="sm" onClick={onDuplicate}>
          <Copy aria-hidden="true" />
          複製
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 aria-hidden="true" />
          削除
        </Button>
      </div>
    </div>
  );
}
