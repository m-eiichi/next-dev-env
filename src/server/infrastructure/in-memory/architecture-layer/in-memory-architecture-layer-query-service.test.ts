import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { InMemoryArchitectureLayerQueryService } from "./in-memory-architecture-layer-query-service";

// 説明ページ（SCR-020）に載せたファイルやコードが、実際のメモとずれていないかを確かめる
describe("InMemoryArchitectureLayerQueryService", async () => {
  const layers = await new InMemoryArchitectureLayerQueryService().list();
  const readSource = (file: string) => readFileSync(resolve(process.cwd(), file), "utf-8");

  it.each(layers.flatMap((layer) => layer.sampleFiles))(
    "メモのファイル $path が存在する",
    ({ path }) => {
      expect(existsSync(resolve(process.cwd(), path))).toBe(true);
    },
  );

  it.each(layers.flatMap((layer) => layer.codeExamples))(
    "コード例が $file の中身と一致する",
    ({ file, code }) => {
      expect(readSource(file)).toContain(code);
    },
  );

  it("返したデータを書き換えても、次に返すデータは変わらない", async () => {
    const queryService = new InMemoryArchitectureLayerQueryService();
    const first = await queryService.list();
    first[0].does.push("追加");
    first[0].sampleFiles[0].note = "変更";

    const second = await queryService.list();

    expect(second[0].does).not.toContain("追加");
    expect(second[0].sampleFiles[0].note).not.toBe("変更");
  });

  it("slug が重ならない", () => {
    const slugs = layers.map((layer) => layer.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
