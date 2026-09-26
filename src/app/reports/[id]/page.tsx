import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ReportEditorSection } from "./_components/report-editor-section";

// ドキュメントの名前を入れると params を読むことになり、メタデータも動的になるので、固定の文言にする
export const metadata: Metadata = {
  title: "ドキュメントエディタ",
};

// 詳細設計: docs/03_画面設計/SCR-041_ドキュメントエディタ.md
// ドキュメントはあとから作られるので generateStaticParams は使わない。params を読む部分は Suspense で囲む（Cache Components）
export default function Page({ params }: PageProps<"/reports/[id]">) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-16 print:max-w-none print:p-0">
      <h1 className="text-3xl font-semibold tracking-tight print:hidden">ドキュメントエディタ</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">読み込み中…</p>}>
        {params.then(({ id }) => (
          <ReportEditorSection id={id} />
        ))}
      </Suspense>
      <Link href="/reports" className="text-sm font-medium text-primary underline-offset-4 hover:underline print:hidden">
        ← ドキュメント一覧へ戻る
      </Link>
    </div>
  );
}
