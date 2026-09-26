"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { createReport } from "@/server/entry/actions/report/create-report";

export function ReportCreateForm() {
  // <form action> は送信のたびに入力欄を空に戻すので、エラーのときに入力を残せるよう値を state で持つ
  const [name, setName] = useState("");
  // 成功すると Server Action の中で エディタ（SCR-041）へ移動する
  const [state, formAction, isPending] = useActionState(createReport, null);
  const nameErrors = state && !state.ok ? (state.fieldErrors?.name ?? [state.message]) : undefined;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-2">
      <label htmlFor="report-name" className="text-sm font-medium">
        新しいドキュメントを作る
      </label>
      <div className="flex gap-2">
        <Input
          id="report-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={50}
          placeholder="例: 納品書"
          aria-invalid={nameErrors ? true : undefined}
          aria-describedby={nameErrors ? "report-name-error" : undefined}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "作成中…" : "作成して描く"}
        </Button>
      </div>
      {nameErrors && (
        <p id="report-name-error" className="text-sm text-destructive">
          {nameErrors.join("、")}
        </p>
      )}
    </form>
  );
}
