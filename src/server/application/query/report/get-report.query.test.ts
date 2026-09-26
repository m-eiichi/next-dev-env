import { describe, expect, it, vi } from "vitest";
import { GetReportQuery } from "./get-report.query";
import type { ReportDto } from "@/server/application/dto/report/report.dto";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

const REPORT: ReportDto = {
  id: "r1",
  name: "請求書",
  paper: { width: 210, height: 297 },
  elements: [],
  createdAt: "2026-09-26T09:00:00.000Z",
  updatedAt: "2026-09-26T09:00:00.000Z",
};

describe("GetReportQuery", () => {
  const queryService = {
    list: vi.fn(),
    findById: vi.fn(async (id: string) => (id === REPORT.id ? REPORT : null)),
  };

  it("ID で 1 件を返す", async () => {
    expect(await new GetReportQuery(queryService).execute("r1")).toEqual(REPORT);
  });

  it("見つからなければ null を返す", async () => {
    expect(await new GetReportQuery(queryService).execute("none")).toBeNull();
  });
});
