import "server-only";
import { ReportNotFoundError } from "@/server/domain/report/errors";
import type { ReportRepository } from "@/server/domain/report/repository";
import type { ReportElementProps } from "@/server/domain/report/value-objects/report-layout";
import { toReportDto, type ReportDto } from "@/server/application/dto/report/report.dto";

// 取り出す → エンティティのメソッドで変える → 保存
// 全員が使える画面なので、認証チェックはしない（docs/03_画面設計/SCR-041_ドキュメントエディタ.md）
export class SaveReportLayoutUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(input: { id: string; elements: ReportElementProps[] }): Promise<ReportDto> {
    const report = await this.reportRepository.findById(input.id);
    if (!report) {
      throw new ReportNotFoundError();
    }

    // 用紙からはみ出さないことなどのルールは、エンティティ（値オブジェクト）が守る
    report.replaceLayout(input.elements, new Date());

    await this.reportRepository.save(report);
    return toReportDto(report);
  }
}
