import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { container } from "@/server/infrastructure/di/container";
import { GetReportQuery } from "@/server/application/query/report/get-report.query";
import type { ReportDto } from "@/server/application/dto/report/report.dto";

// 見つからなければ null を返す。404 にするのは画面（docs/03_画面設計/SCR-041_ドキュメントエディタ.md）
export async function getReport(id: string): Promise<ReportDto | null> {
  "use cache";
  cacheLife("max");
  cacheTag("reports");

  // Composition Root: 依存を組み立ててクエリを作る
  const query = new GetReportQuery(container.reportQueryService());
  return query.execute(id);
}
