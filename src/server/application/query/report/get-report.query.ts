import "server-only";
import type { ReportDto } from "@/server/application/dto/report/report.dto";
import type { ReportQueryService } from "./report-query-service";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-041_ドキュメントエディタ.md）
// 見つからなければ null を返す。404 にするかどうかは画面が決める
export class GetReportQuery {
  constructor(private readonly reportQueryService: ReportQueryService) {}

  async execute(id: string): Promise<ReportDto | null> {
    return this.reportQueryService.findById(id);
  }
}
