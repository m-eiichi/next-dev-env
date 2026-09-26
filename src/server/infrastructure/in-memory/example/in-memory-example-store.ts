import "server-only";

// DB が決まるまでの仮のデータ置き場。読み取り（Query Service）と更新（リポジトリ）が、この 1 つの配列を共有する
// サーバーを立ち上げ直すと、登録したものは消える。サーバーレスの環境では、アクセスをまたいで残らないことがある
// （docs/03_画面設計/SCR-012_サンプル登録.md の「7.2」）

// DB の 1 行にあたる形
export type ExampleRow = {
  id: string;
  title: string;
  description: string | null;
};

// 新しいものほど先頭に置く
export const exampleRows: ExampleRow[] = [
  {
    id: "example-1",
    title: "取得の関数から呼ばれる",
    description: "page.tsx は src/server/entry/queries/ の関数を呼ぶだけです。",
  },
  {
    id: "example-2",
    title: "クエリが DTO を返す",
    description: "読み取りはドメイン層を通らず、Query Service から DTO を受け取ります。",
  },
  {
    id: "example-3",
    title: "リポジトリを差し替えられる",
    description: "DB が決まったら、DI コンテナで返す実装を入れ替えます。",
  },
  {
    id: "example-4",
    title: "TanStack Query で検索する",
    description: "入力に合わせて、ブラウザから /api/internal/examples を呼びます。",
  },
  {
    id: "example-5",
    title: "Route Handler は読み込むだけ",
    description: "route.ts の中身は src/server/entry/api/ に書きます。",
  },
];
