import "server-only";
import { Report } from "@/server/domain/report/entity";
import type { ReportRepository } from "@/server/domain/report/repository";
import { reportRows, type ReportRow } from "./in-memory-report-store";

// 更新側。DB の行とエンティティを変換して、仮のデータ置き場を読み書きする
export class InMemoryReportRepository implements ReportRepository {
  async findById(id: string): Promise<Report | null> {
    const row = reportRows.find((item) => item.id === id);
    return row ? toEntity(row) : null;
  }

  async save(report: Report): Promise<void> {
    const row = toRow(report);
    const index = reportRows.findIndex((item) => item.id === report.id);
    if (index !== -1) {
      reportRows.splice(index, 1);
    }
    // 更新したのが新しいものほど先頭に置く
    reportRows.unshift(row);
  }
}

function toEntity(row: ReportRow): Report {
  return Report.reconstruct({
    id: row.id,
    name: row.name,
    elements: row.elements,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  });
}

function toRow(report: Report): ReportRow {
  return {
    id: report.id,
    name: report.name.value,
    elements: report.elements,
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
  };
}
