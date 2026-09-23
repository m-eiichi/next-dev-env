import "server-only";
import { Example } from "@/server/domain/example/entity";
import type { ExampleRepository } from "@/server/domain/example/repository";

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
] as const;

export class InMemoryExampleRepository implements ExampleRepository {
  async list(): Promise<Example[]> {
    return ROWS.map((row) => Example.reconstruct(row));
  }
}
