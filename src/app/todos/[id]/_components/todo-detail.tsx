import { notFound } from "next/navigation";
import { getTodo } from "@/server/entry/queries/todo/get-todo";
import { TodoActions } from "./todo-actions";

// ISO 8601 の日時を、日本時間の「YYYY/MM/DD HH:mm」にする
function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export async function TodoDetail({ id }: { id: string }) {
  const todo = await getTodo(id);
  if (!todo) {
    notFound();
  }

  return (
    <section className="flex max-w-xl flex-col gap-4">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">タイトル</dt>
        <dd className="break-all font-medium">{todo.title}</dd>
        <dt className="text-muted-foreground">状態</dt>
        <dd>{todo.completed ? "完了" : "未完了"}</dd>
        <dt className="text-muted-foreground">作った日時</dt>
        <dd>{formatDateTime(todo.createdAt)}</dd>
        {todo.completedAt && (
          <>
            <dt className="text-muted-foreground">完了した日時</dt>
            <dd>{formatDateTime(todo.completedAt)}</dd>
          </>
        )}
      </dl>
      <TodoActions id={todo.id} completed={todo.completed} />
    </section>
  );
}
