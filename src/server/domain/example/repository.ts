import type { Example } from "./entity";
import type { ExampleTitle } from "./value-objects/example-title";

// 更新（command）に要るものだけを置く。一覧・検索は Query Service
// （src/server/application/query/example/example-query-service.ts。docs/01_全体設計/06_アーキテクチャ.md の「4.3」）
export interface ExampleRepository {
  save(example: Example): Promise<void>;
  // 同じタイトルのサンプルがあるか（前後の空白を除いて比べる）
  existsByTitle(title: ExampleTitle): Promise<boolean>;
}
