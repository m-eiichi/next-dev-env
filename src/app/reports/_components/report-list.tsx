import Link from "next/link";
import type { ReportSummaryDto } from "@/server/application/dto/report/report.dto";

// ISO 8601 の日時を、日本時間の「YYYY/MM/DD HH:mm」にする
function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function ReportList({ reports }: { reports: ReportSummaryDto[] }) {
  return (
    <section aria-labelledby="report-list-heading" className="flex flex-col gap-4">
      <h2 id="report-list-heading" className="text-xl font-semibold">
        保存したドキュメント
      </h2>
      {reports.length === 0 ? (
        <p className="text-sm text-muted-foreground">ドキュメントはありません</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {reports.map((report) => (
            <li key={report.id}>
              <Link
                href={`/reports/${report.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-4 py-3 hover:bg-muted"
              >
                <span className="font-medium break-all">{report.name}</span>
                <span className="text-sm text-muted-foreground">
                  部品 {report.elementCount} 個・更新 {formatDateTime(report.updatedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
