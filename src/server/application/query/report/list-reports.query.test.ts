import { describe, expect, it, vi } from "vitest";
import { ListReportsQuery } from "./list-reports.query";
import type { ReportSummaryDto } from "@/server/application/dto/report/report.dto";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

const SUMMARY: ReportSummaryDto = {
  id: "r1",
  name: "請求書",
  elementCount: 3,
  updatedAt: "2026-09-26T09:00:00.000Z",
};

describe("ListReportsQuery", () => {
  it("Query Service の一覧をそのまま返す", async () => {
    const queryService = { list: vi.fn(async () => [SUMMARY]), findById: vi.fn() };

    expect(await new ListReportsQuery(queryService).execute()).toEqual([SUMMARY]);
    expect(queryService.list).toHaveBeenCalledOnce();
  });
});
