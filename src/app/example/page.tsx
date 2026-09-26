import type { Metadata } from "next";
import Link from "next/link";
import { listExamples } from "@/server/entry/queries/example/list-examples";
import { ExampleList } from "./_components/example-list";

export const metadata: Metadata = {
  title: "サンプル一覧",
};

// 詳細設計: docs/03_画面設計/SCR-010_サンプル一覧.md
export default async function Page() {
  const examples = await listExamples();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">サンプル一覧</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          フロント → 入口 → ユースケース → ドメイン → インフラストラクチャの順に処理が流れる見本です。データはメモリ上の仮のリポジトリから取得しています。
        </p>
      </section>
      <ExampleList examples={examples} />
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          ← トップへ戻る
        </Link>
        <Link
          href="/example/search"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          検索のサンプル（TanStack Query）を見る →
        </Link>
        <Link
          href="/example/new"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          サンプルを登録する（Server Action）→
        </Link>
      </div>
    </div>
  );
}
