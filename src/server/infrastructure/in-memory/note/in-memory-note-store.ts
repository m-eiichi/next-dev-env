import "server-only";

// DB が決まるまでの仮のデータ置き場。読み取り（Query Service）と更新（リポジトリ）が、この 1 つの配列を共有する
// サーバーを立ち上げ直すと、登録したものは消える。サーバーレスの環境では、アクセスをまたいで残らないことがある
// （docs/03_画面設計/SCR-012_メモ登録.md の「7.2」）

// DB の 1 行にあたる形
export type NoteRow = {
  id: string;
  title: string;
  body: string | null;
};

// 新しいものほど先頭に置く
export const noteRows: NoteRow[] = [
  {
    id: "note-1",
    title: "会議のメモ",
    body: "来週の定例で、画面設計のレビューをする。",
  },
  {
    id: "note-2",
    title: "読みたい本",
    body: "ドメイン駆動設計の入門書を読む。",
  },
  {
    id: "note-3",
    title: "買い物リスト",
    body: "牛乳、卵、食パン",
  },
  {
    id: "note-4",
    title: "Next.js の勉強",
    body: "Cache Components と 'use cache' を試す。",
  },
  {
    id: "note-5",
    title: "旅行の予定",
    body: null,
  },
];
