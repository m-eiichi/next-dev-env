import type { Metadata } from "next";
import Link from "next/link";
import { listReports } from "@/server/entry/queries/report/list-reports";
import { ReportCreateForm } from "./_components/report-create-form";
import { ReportList } from "./_components/report-list";

export const metadata: Metadata = {
  title: "ドキュメント一覧",
};

// 詳細設計: docs/03_画面設計/SCR-040_ドキュメント一覧.md
export default async function Page() {
  const reports = await listReports();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">ドキュメント一覧</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          実装の見本です（アプリの機能ではありません）。お絵描きツールのように、テキスト・四角形・線を A4
          の用紙に置いて、請求書・案内状・チラシなどのドキュメントを作れます。データはメモリ上に置くので、サーバーを立ち上げ直すと元に戻ります。
        </p>
      </section>
      <ReportCreateForm />
      <ReportList reports={reports} />
      <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        ← トップへ戻る
      </Link>
    </div>
  );
}
