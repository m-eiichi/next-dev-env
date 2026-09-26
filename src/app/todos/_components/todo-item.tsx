"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { Button } from "@/components/atoms/button";
import type { TodoDto } from "@/server/application/dto/todo/todo.dto";
import { completeTodo } from "@/server/entry/actions/todo/complete-todo";
import { deleteTodo } from "@/server/entry/actions/todo/delete-todo";
import { reopenTodo } from "@/server/entry/actions/todo/reopen-todo";

// 行ごとの操作の見本（docs/03_画面設計/SCR-030_TODO一覧.md の「6」）
export function TodoItem({ todo }: { todo: TodoDto }) {
  // サーバーの結果を待たずに、チェックをすぐ切り替えて見せる。失敗したら、props の値（元の状態）に戻る
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(todo.completed);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    const next = !optimisticCompleted;
    setError(null);
    startTransition(async () => {
      setOptimisticCompleted(next);
      const result = next ? await completeTodo(todo.id) : await reopenTodo(todo.id);
      if (!result.ok) {
        setError(result.message);
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteTodo(todo.id);
      if (!result.ok) {
        setError(result.message);
      }
    });
  };

  return (
    <li className="flex flex-col gap-1 rounded-lg border border-border px-3 py-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={optimisticCompleted}
          onChange={handleToggle}
          disabled={isPending}
          aria-label={`「${todo.title}」を${optimisticCompleted ? "未完了に戻す" : "完了にする"}`}
          className="size-4 accent-primary"
        />
        <Link
          href={`/todos/${todo.id}`}
          className={`flex-1 break-all underline-offset-4 hover:underline ${optimisticCompleted ? "text-muted-foreground line-through" : ""}`}
        >
          {todo.title}
        </Link>
        <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
          削除
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </li>
  );
}
