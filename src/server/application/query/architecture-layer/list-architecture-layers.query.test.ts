import { describe, expect, it, vi } from "vitest";
import { ListArchitectureLayersQuery } from "./list-architecture-layers.query";
import type { ArchitectureLayerDto } from "@/server/application/dto/architecture-layer/architecture-layer.dto";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

const LAYER: ArchitectureLayerDto = {
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

describe("ListArchitectureLayersQuery", () => {
  it("Query Service の一覧を、同じ順番のまま返す", async () => {
    const queryService = { list: vi.fn(async () => [LAYER, { ...LAYER, slug: "infrastructure" }]) };

    const result = await new ListArchitectureLayersQuery(queryService).execute();

    expect(queryService.list).toHaveBeenCalledOnce();
    expect(result.map((layer) => layer.slug)).toEqual(["domain", "infrastructure"]);
  });
});
