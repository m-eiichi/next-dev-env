import { describe, expect, it } from "vitest";
import { Report } from "@/server/domain/report/entity";
import { InMemoryReportQueryService } from "./in-memory-report-query-service";
import { InMemoryReportRepository } from "./in-memory-report-repository";

// 更新（リポジトリ）と読み取り（Query Service）が、同じ仮のデータを共有していることを確かめる
describe("InMemoryReportRepository", () => {
  const repository = new InMemoryReportRepository();
  const queryService = new InMemoryReportQueryService();

  it("見本のドキュメントは、ドメインのルールに合っている（作り直せる）", async () => {
    const report = await repository.findById("report-1");

    expect(report?.elements.length).toBeGreaterThan(0);
  });

  it("追加したドキュメントが、読み取り側の一覧の先頭に出る", async () => {
    const report = Report.create({ name: "納品書" }, new Date("2026-09-26T09:00:00Z"));

    await repository.save(report);
    const [first] = await queryService.list();

    expect(first).toMatchObject({ id: report.id, name: "納品書", elementCount: 0 });
  });

  it("レイアウトを置き換えて保存すると、読み取り側に反映され、一覧の先頭に移る", async () => {
    const report = await repository.findById("report-1");
    report!.replaceLayout(
      [{ kind: "line", id: "l1", x1: 0, y1: 0, x2: 10, y2: 0, strokeWidth: 0.3 }],
      new Date("2026-09-26T10:00:00Z"),
    );
    await repository.save(report!);

    const [first] = await queryService.list();
    const found = await queryService.findById("report-1");

    expect(first.id).toBe("report-1");
    expect(found?.elements).toHaveLength(1);
    expect(found?.updatedAt).toBe("2026-09-26T10:00:00.000Z");
  });

  it("読み取り側が返した部品を書き換えても、仮のデータは変わらない", async () => {
    const found = await queryService.findById("report-1");
    found!.elements[0].id = "changed";

    expect((await queryService.findById("report-1"))?.elements[0].id).toBe("l1");
  });
});
