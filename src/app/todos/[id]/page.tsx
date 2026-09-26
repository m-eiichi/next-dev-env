import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TodoDetail } from "./_components/todo-detail";

// タイトルを入れると params を読むことになり、メタデータも動的になるので、固定の文言にする
export const metadata: Metadata = {
  title: "TODO の詳細",
};

// 詳細設計: docs/03_画面設計/SCR-031_TODO詳細.md
// TODO はあとから登録されるので generateStaticParams は使わない。params を読む部分は Suspense で囲む（Cache Components）
export default function Page({ params }: PageProps<"/todos/[id]">) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">TODO の詳細</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">読み込み中…</p>}>
        {params.then(({ id }) => (
          <TodoDetail id={id} />
        ))}
      </Suspense>
      <Link href="/todos" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        ← TODO 一覧へ戻る
      </Link>
    </div>
  );
}
