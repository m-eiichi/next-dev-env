import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TodoAddForm } from "./_components/todo-add-form";
import { TodoListSection } from "./_components/todo-list-section";

export const metadata: Metadata = {
  title: "TODO 一覧",
};

// 詳細設計: docs/03_画面設計/SCR-030_TODO一覧.md
export default function Page({ searchParams }: PageProps<"/todos">) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">TODO 一覧</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          実装の見本です（アプリの機能ではありません）。TODO を題材に、URL での絞り込み、一覧の行ごとの操作、画面の即時反映（useOptimistic）を見られます。データはメモリ上に置くので、サーバーを立ち上げ直すと元に戻ります。
        </p>
      </section>
      <TodoAddForm />
      {/* searchParams はアクセスのたびに変わるデータなので、読む部品を Suspense で囲む（Cache Components） */}
      <Suspense fallback={<p className="text-sm text-muted-foreground">読み込み中…</p>}>
        <TodoListSection searchParams={searchParams} />
      </Suspense>
      <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        ← トップへ戻る
      </Link>
    </div>
  );
}
