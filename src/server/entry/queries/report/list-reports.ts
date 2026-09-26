import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { container } from "@/server/infrastructure/di/container";
import { ListReportsQuery } from "@/server/application/query/report/list-reports.query";
import type { ReportSummaryDto } from "@/server/application/dto/report/report.dto";

export async function listReports(): Promise<ReportSummaryDto[]> {
  // 変わるのは作成・保存のときだけなので、そのときにタグで捨てる（docs/03_画面設計/SCR-040_ドキュメント一覧.md の「7.1」）
  "use cache";
  cacheLife("max");
  cacheTag("reports");

  // Composition Root: 依存を組み立ててクエリを作る
  const query = new ListReportsQuery(container.reportQueryService());
  return query.execute();
}
