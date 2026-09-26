import type { Report } from "@/server/domain/report/entity";
import type { ReportElementProps } from "@/server/domain/report/value-objects/report-layout";
import { PAPER_A4 } from "@/server/domain/report/value-objects/report-layout";

// ドキュメントに置く部品。長さの単位は mm、文字の大きさは pt
export type ReportElementDto = ReportElementProps;

// エディタに渡す 1 件（部品をすべて含む）
export type ReportDto = {
  id: string;
  name: string;
  paper: { width: number; height: number }; // mm
  elements: ReportElementDto[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

// 一覧に出す項目だけを持つ
export type ReportSummaryDto = {
  id: string;
  name: string;
  elementCount: number;
  updatedAt: string; // ISO 8601
};

export function toReportDto(report: Report): ReportDto {
  return {
    id: report.id,
    name: report.name.value,
    paper: { ...PAPER_A4 },
    elements: report.elements,
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
  };
}
