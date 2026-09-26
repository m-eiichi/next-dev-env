"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import type { TodoDto } from "@/server/application/dto/todo/todo.dto";
import { createTodo } from "@/server/entry/actions/todo/create-todo";
import type { ActionResult } from "@/server/entry/actions/types";

export function TodoAddForm() {
  // <form action> は送信のたびに入力欄を空に戻すので、エラーのときに入力を残せるよう値を state で持つ
  const [title, setTitle] = useState("");
  const [state, formAction, isPending] = useActionState(
    async (prev: ActionResult<TodoDto> | null, formData: FormData) => {
      const result = await createTodo(prev, formData);
      // 追加できたら入力欄を空にする
      if (result.ok) {
        setTitle("");
      }
      return result;
    },
    null,
  );
  const titleErrors = state && !state.ok ? (state.fieldErrors?.title ?? [state.message]) : undefined;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-2">
      <label htmlFor="todo-title" className="text-sm font-medium">
        TODO を追加する
      </label>
      <div className="flex gap-2">
        <Input
          id="todo-title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          maxLength={100}
          placeholder="例: 画面設計を書く"
          aria-invalid={titleErrors ? true : undefined}
          aria-describedby={titleErrors ? "todo-title-error" : undefined}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "追加中…" : "追加"}
        </Button>
      </div>
      {titleErrors && (
        <p id="todo-title-error" className="text-sm text-destructive">
          {titleErrors.join("、")}
        </p>
      )}
    </form>
  );
}
