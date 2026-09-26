import type { Metadata } from "next";
import Link from "next/link";
import { listNotes } from "@/server/entry/queries/note/list-notes";
import { NoteList } from "./_components/note-list";

export const metadata: Metadata = {
  title: "メモ一覧",
};

// 詳細設計: docs/03_画面設計/SCR-010_メモ一覧.md
export default async function Page() {
  const notes = await listNotes();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">メモ一覧</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          実装の見本です（アプリの機能ではありません）。メモを題材に、読み取り（query）の流れ（画面 → 取得の関数 → クエリ → Query Service）とキャッシュの付け方を見られます。データはメモリ上の仮のデータ置き場から取得しています。
        </p>
      </section>
      <NoteList notes={notes} />
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          ← トップへ戻る
        </Link>
        <Link
          href="/notes/search"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          メモを検索する（TanStack Query）→
        </Link>
        <Link
          href="/notes/new"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          メモを登録する（Server Action）→
        </Link>
      </div>
    </div>
  );
}
