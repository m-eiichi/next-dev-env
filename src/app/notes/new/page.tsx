import type { Metadata } from "next";
import Link from "next/link";
import { NoteForm } from "./_components/note-form";

export const metadata: Metadata = {
  title: "メモ登録",
};

// 詳細設計: docs/03_画面設計/SCR-012_メモ登録.md
export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">メモ登録</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          実装の見本です（アプリの機能ではありません）。メモを題材に、更新（command）の流れを見られます。フォームから Server Action を呼び、ユースケースがエンティティとリポジトリで業務のルール（タイトルの重複禁止など）を守って保存します。登録したデータはメモリ上に置くので、サーバーを立ち上げ直すと消えます。
        </p>
      </section>
      <NoteForm />
      <Link
        href="/notes"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        ← メモ一覧へ戻る
      </Link>
    </div>
  );
}
