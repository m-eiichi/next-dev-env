import { describe, expect, it, vi } from "vitest";
import { SaveReportLayoutUseCase } from "./save-report-layout.usecase";
import { Report } from "@/server/domain/report/entity";
import { ReportNotFoundError } from "@/server/domain/report/errors";
import type { ReportElementProps } from "@/server/domain/report/value-objects/report-layout";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

const LINE: ReportElementProps = { kind: "line", id: "l1", x1: 10, y1: 20, x2: 200, y2: 20, strokeWidth: 0.3 };

function createRepository(report: Report | null) {
  return { findById: vi.fn(async () => report), save: vi.fn(async () => {}) };
}

describe("SaveReportLayoutUseCase", () => {
  it("取り出したドキュメントのレイアウトを置き換えて保存し、DTO で返す", async () => {
    const report = Report.create({ name: "請求書" }, new Date("2026-09-26T09:00:00Z"));
    const repository = createRepository(report);

    const result = await new SaveReportLayoutUseCase(repository).execute({ id: report.id, elements: [LINE] });

    expect(repository.findById).toHaveBeenCalledWith(report.id);
    expect(repository.save).toHaveBeenCalledWith(report);
    expect(result.elements).toEqual([LINE]);
  });

  it("見つからなければ ReportNotFoundError になり、保存しない", async () => {
    const repository = createRepository(null);

    await expect(new SaveReportLayoutUseCase(repository).execute({ id: "none", elements: [] })).rejects.toThrow(
      ReportNotFoundError,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("レイアウトがルールに合わなければ DomainError になり、保存しない", async () => {
    const report = Report.create({ name: "請求書" }, new Date("2026-09-26T09:00:00Z"));
    const repository = createRepository(report);

    await expect(
      new SaveReportLayoutUseCase(repository).execute({ id: report.id, elements: [{ ...LINE, x2: 999 }] }),
    ).rejects.toThrow("はみ出しています");
    expect(repository.save).not.toHaveBeenCalled();
  });
});
