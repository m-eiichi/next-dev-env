"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { createExample } from "@/server/entry/actions/example/create-example";

// 成功したときは Server Action の中で一覧へ移動するので、ここで受け取るのは失敗したときの結果だけ
export function ExampleForm() {
  const [state, formAction, isPending] = useActionState(createExample, null);
  // <form action> は送信のたびに入力欄を空に戻すので、エラーのときに入力を残せるよう値を state で持つ
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const titleErrors = fieldErrors?.title;
  const descriptionErrors = fieldErrors?.description;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {state && !state.ok && !fieldErrors && (
        <p role="alert" className="rounded-lg border border-destructive/50 p-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          タイトル（必須）
        </label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          maxLength={100}
          aria-invalid={titleErrors ? true : undefined}
          aria-describedby={titleErrors ? "title-error" : undefined}
        />
        {titleErrors && (
          <p id="title-error" className="text-sm text-destructive">
            {titleErrors.join("、")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          説明（任意、200 文字以内）
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          maxLength={200}
          aria-invalid={descriptionErrors ? true : undefined}
          aria-describedby={descriptionErrors ? "description-error" : undefined}
          className="rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm dark:bg-input/30"
        />
        {descriptionErrors && (
          <p id="description-error" className="text-sm text-destructive">
            {descriptionErrors.join("、")}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="self-start">
        {isPending ? "登録中…" : "登録する"}
      </Button>
    </form>
  );
}
