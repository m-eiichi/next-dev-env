import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { InMemoryArchitectureLayerRepository } from "./in-memory-architecture-layer-repository";

// 説明ページ（SCR-020）に載せたファイルやコードが、実際のサンプルとずれていないかを確かめる
describe("InMemoryArchitectureLayerRepository", async () => {
  const layers = await new InMemoryArchitectureLayerRepository().list();
  const readSource = (file: string) => readFileSync(resolve(process.cwd(), file), "utf-8");

  it.each(layers.flatMap((layer) => layer.sampleFiles))(
    "サンプルのファイル $path が存在する",
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

  it("slug が重ならない", () => {
    const slugs = layers.map((layer) => layer.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
