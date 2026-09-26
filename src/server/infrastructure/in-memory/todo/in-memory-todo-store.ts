import "server-only";

// DB が決まるまでの仮のデータ置き場。読み取り（Query Service）と更新（リポジトリ）が、この 1 つの配列を共有する
// サーバーを立ち上げ直すと、変更は消える（docs/03_画面設計/SCR-030_TODO一覧.md の「7.2」）

// DB の 1 行にあたる形。日時は ISO 8601 の文字列で持つ
export type TodoRow = {
  id: string;
  title: string;
  createdAt: string;
  completedAt: string | null;
};

// 新しいものほど先頭に置く
export const todoRows: TodoRow[] = [
  {
    id: "todo-1",
    title: "画面設計を書く",
    createdAt: "2026-09-26T03:00:00.000Z",
    completedAt: null,
  },
  {
    id: "todo-2",
    title: "ユースケースのテストを書く",
    createdAt: "2026-09-26T02:00:00.000Z",
    completedAt: null,
  },
  {
    id: "todo-3",
    title: "設計の資料を読む",
    createdAt: "2026-09-26T01:00:00.000Z",
    completedAt: "2026-09-26T01:30:00.000Z",
  },
];
