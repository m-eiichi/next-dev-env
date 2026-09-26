import type { Report } from "./entity";

// 更新（command）に要るものだけを置く。一覧・1 件の取得は Query Service
// （src/server/application/query/report/report-query-service.ts。docs/01_全体設計/06_アーキテクチャ.md の「4.3」）
export interface ReportRepository {
  // レイアウトを置き換える前に、今の状態を取り出すため
  findById(id: string): Promise<Report | null>;
  // 新しければ追加し、あれば上書きする
  save(report: Report): Promise<void>;
}
