import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { container } from "@/server/infrastructure/di/container";
import { ListExamplesQuery } from "@/server/application/query/example/list-examples.query";
import type { ExampleDto } from "@/server/application/dto/example/example.dto";

export async function listExamples(): Promise<ExampleDto[]> {
  // データが変わるのは登録（SCR-012）のときだけなので、時間では作り直さず、登録のときにタグで捨てる
  // （docs/03_画面設計/SCR-010_サンプル一覧.md の「7.1」、docs/02_共通設計/04_データ取得・更新.md の「2」）
  "use cache";
  cacheLife("max");
  cacheTag("examples");

  // Composition Root: 依存を組み立ててクエリを作る
  const query = new ListExamplesQuery(container.exampleQueryService());
  return query.execute();
}
