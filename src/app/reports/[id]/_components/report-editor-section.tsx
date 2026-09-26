import { notFound } from "next/navigation";
import { getReport } from "@/server/entry/queries/report/get-report";
import { ReportEditor } from "./report-editor";

export async function ReportEditorSection({ id }: { id: string }) {
  const report = await getReport(id);
  if (!report) {
    notFound();
  }

  return (
    <section aria-label={`ドキュメント「${report.name}」`} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground print:hidden">
        ドキュメント: <span className="font-medium break-all text-foreground">{report.name}</span>
      </p>
      <ReportEditor report={report} />
    </section>
  );
}
