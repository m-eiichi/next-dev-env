import "server-only";
import { Report } from "@/server/domain/report/entity";
import type { ReportRepository } from "@/server/domain/report/repository";
import { toReportDto, type ReportDto } from "@/server/application/dto/report/report.dto";

// 全員が使える画面なので、認証チェックはしない（docs/03_画面設計/SCR-040_ドキュメント一覧.md）
export class CreateReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(input: { name: string }): Promise<ReportDto> {
    const report = Report.create(input, new Date());
    await this.reportRepository.save(report);
    return toReportDto(report);
  }
}
