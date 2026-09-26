import type { ReportDto, ReportSummaryDto } from "@/server/application/dto/report/report.dto";

// 読み取り専用のインターフェース。実装はインフラストラクチャ層
export interface ReportQueryService {
  // 更新したのが新しいものから順に返す
  list(): Promise<ReportSummaryDto[]>;
  findById(id: string): Promise<ReportDto | null>;
}
