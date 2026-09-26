import "server-only";
import { PAPER_A4 } from "@/server/domain/report/value-objects/report-layout";
import type { ReportDto, ReportSummaryDto } from "@/server/application/dto/report/report.dto";
import type { ReportQueryService } from "@/server/application/query/report/report-query-service";
import { reportRows } from "./in-memory-report-store";

// 読み取り側。エンティティを通さず、仮のデータから DTO を直接作る
export class InMemoryReportQueryService implements ReportQueryService {
  async list(): Promise<ReportSummaryDto[]> {
    return reportRows.map((row) => ({
      id: row.id,
      name: row.name,
      elementCount: row.elements.length,
      updatedAt: row.updatedAt,
    }));
  }

  async findById(id: string): Promise<ReportDto | null> {
    const row = reportRows.find((item) => item.id === id);
    if (!row) {
      return null;
    }
    return {
      id: row.id,
      name: row.name,
      paper: { ...PAPER_A4 },
      // 配列はコピーして返す（仮のデータ置き場を画面側から書き換えさせない）
      elements: row.elements.map((element) => ({ ...element })),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
