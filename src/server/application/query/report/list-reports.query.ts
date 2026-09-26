import "server-only";
import type { ReportSummaryDto } from "@/server/application/dto/report/report.dto";
import type { ReportQueryService } from "./report-query-service";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-040_ドキュメント一覧.md）
export class ListReportsQuery {
  constructor(private readonly reportQueryService: ReportQueryService) {}

  async execute(): Promise<ReportSummaryDto[]> {
    return this.reportQueryService.list();
  }
}
