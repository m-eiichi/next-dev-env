"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/atoms/button";
import { completeTodo } from "@/server/entry/actions/todo/complete-todo";
import { deleteTodo } from "@/server/entry/actions/todo/delete-todo";
import { reopenTodo } from "@/server/entry/actions/todo/reopen-todo";

// 状態を変える操作と削除（docs/03_画面設計/SCR-031_TODO詳細.md の「6」）
export function TodoActions({ id, completed }: { id: string; completed: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    setError(null);
    startTransition(async () => {
      // 画面の表示は、Server Action の updateTag の後にサーバーから届く新しい内容で切り替わる
      const result = completed ? await reopenTodo(id) : await completeTodo(id);
      if (!result.ok) {
        setError(result.message);
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteTodo(id);
      if (result.ok) {
        router.push("/todos");
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button onClick={handleToggle} disabled={isPending}>
          {completed ? "元に戻す" : "完了にする"}
        </Button>
        <Button variant="outline" onClick={handleDelete} disabled={isPending}>
          削除
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
