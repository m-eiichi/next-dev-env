import "server-only";
import { Example } from "@/server/domain/example/entity";
import type { ExampleFilter, ExampleRepository } from "@/server/domain/example/repository";

// DB が決まるまでの仮の実装。メモリ上の固定のデータを返す
const ROWS = [
  {
    id: "example-1",
    title: "取得の関数から呼ばれる",
    description: "page.tsx は src/server/entry/queries/ の関数を呼ぶだけです。",
  },
  {
    id: "example-2",
    title: "ユースケースが DTO に変換する",
    description: "画面にはエンティティではなく、プレーンなオブジェクトが渡ります。",
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
] as const;

export class InMemoryExampleRepository implements ExampleRepository {
  async list(filter: ExampleFilter = {}): Promise<Example[]> {
    const keyword = filter.keyword?.toLowerCase();
    const rows = keyword
      ? ROWS.filter(
          (row) =>
            row.title.toLowerCase().includes(keyword) ||
            row.description.toLowerCase().includes(keyword),
        )
      : ROWS;
    return rows.map((row) => Example.reconstruct(row));
  }
}
