import Link from "next/link";
import type { TodoStatusFilter } from "@/server/application/dto/todo/todo.dto";
import { listTodos } from "@/server/entry/queries/todo/list-todos";
import { TodoItem } from "./todo-item";

const FILTERS: { label: string; status?: TodoStatusFilter }[] = [
  { label: "すべて" },
  { label: "未完了", status: "open" },
  { label: "完了", status: "completed" },
];

// URL の ?status= を、取得の関数に渡せる値にする（知らない値ならすべて）
function toStatus(value: string | string[] | undefined): TodoStatusFilter | undefined {
  return value === "open" || value === "completed" ? value : undefined;
}

export async function TodoListSection({ searchParams }: Pick<PageProps<"/todos">, "searchParams">) {
  const status = toStatus((await searchParams).status);
  const todos = await listTodos(status);

  return (
    <section aria-labelledby="todo-list-heading" className="flex flex-col gap-4">
      <h2 id="todo-list-heading" className="sr-only">
        TODO の一覧
      </h2>
      <nav aria-label="絞り込み" className="flex gap-2">
        {FILTERS.map((filter) => {
          const isCurrent = filter.status === status;
          return (
            <Link
              key={filter.label}
              href={filter.status ? `/todos?status=${filter.status}` : "/todos"}
              aria-current={isCurrent ? "page" : undefined}
              className="rounded-lg border border-border px-3 py-1 text-sm aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>
      {todos.length === 0 ? (
        <p className="text-sm text-muted-foreground">TODO はありません</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </section>
  );
}
