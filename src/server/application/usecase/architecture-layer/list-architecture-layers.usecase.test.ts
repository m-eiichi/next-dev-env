import { describe, expect, it, vi } from "vitest";
import { ListArchitectureLayersUseCase } from "./list-architecture-layers.usecase";
import type { ArchitectureLayer } from "@/server/domain/architecture-layer/repository";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

const LAYER: ArchitectureLayer = {
  slug: "domain",
  name: "ドメイン層",
  path: "src/server/domain/",
  role: "業務のルール",
  does: ["業務のルールを書く"],
  doesNot: ["Next.js を使う"],
  cannotImport: ["ほかのすべての層"],
  sampleFiles: [{ path: "src/server/domain/example/entity.ts", note: "エンティティ" }],
  codeExamples: [{ file: "src/server/domain/example/entity.ts", code: "export class Example", points: ["ポイント"] }],
  docSection: "4.4 ドメイン層",
};

describe("ListArchitectureLayersUseCase", () => {
  it("リポジトリの一覧を、同じ順番のまま DTO に変換して返す", async () => {
    const repository = {
      list: vi.fn(async () => [LAYER, { ...LAYER, slug: "infrastructure" }]),
    };

    const result = await new ListArchitectureLayersUseCase(repository).execute();

    expect(repository.list).toHaveBeenCalledOnce();
    expect(result.map((layer) => layer.slug)).toEqual(["domain", "infrastructure"]);
    expect(result[0]).toEqual(LAYER);
  });

  it("DTO の配列を書き換えても、リポジトリのデータは変わらない", async () => {
    const source = structuredClone(LAYER);
    const [dto] = await new ListArchitectureLayersUseCase({
      list: vi.fn(async () => [source]),
    }).execute();

    dto.does.push("追加");
    dto.sampleFiles[0].note = "変更";
    dto.codeExamples[0].points.push("追加");

    expect(source).toEqual(LAYER);
  });
});
