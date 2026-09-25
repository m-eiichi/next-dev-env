import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listExamples } from "@/server/entry/queries/example/list-examples";
import { ExampleList } from "../_components/example-list";
import { ExampleSearch } from "./_components/example-search";

export const metadata: Metadata = {
  title: "サンプル検索",
};

// 詳細設計: docs/03_画面設計/SCR-011_サンプル検索.md
export default async function Page() {
  // 初期表示はサーバーで取得し、TanStack Query の initialData にする
  const examples = await listExamples();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">サンプル検索</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          TanStack Query を使う見本です。最初の一覧はサーバーで取得し、入力した後はブラウザから /api/internal/examples を呼んで絞り込みます。
        </p>
      </section>
      {/* TanStack Query は initialData を受け取るときに現在時刻を読むので、Suspense の内側に置く。
          ビルド時に作る静的な枠には fallback（同じ一覧）が入る（docs/02_共通設計/04_データ取得・更新.md の「5.2」） */}
      <Suspense fallback={<ExampleList examples={examples} />}>
        <ExampleSearch initialExamples={examples} />
      </Suspense>
      <Link
        href="/example"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        ← サンプル一覧へ戻る
      </Link>
    </div>
  );
}
