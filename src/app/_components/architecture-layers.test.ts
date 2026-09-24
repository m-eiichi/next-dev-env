import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ARCHITECTURE_LAYERS } from "./architecture-layers";

// 説明ページ（SCR-020）に載せたファイルやコードが、実際のサンプルとずれていないかを確かめる
describe("ARCHITECTURE_LAYERS", () => {
  const readSource = (file: string) => readFileSync(resolve(process.cwd(), file), "utf-8");

  it.each(ARCHITECTURE_LAYERS.flatMap((layer) => layer.sampleFiles))(
    "サンプルのファイル $path が存在する",
    ({ path }) => {
      expect(existsSync(resolve(process.cwd(), path))).toBe(true);
    },
  );

  it.each(ARCHITECTURE_LAYERS.flatMap((layer) => layer.codeExamples))(
    "コード例が $file の中身と一致する",
    ({ file, code }) => {
      expect(readSource(file)).toContain(code);
    },
  );

  it("slug が重ならない", () => {
    const slugs = ARCHITECTURE_LAYERS.map((layer) => layer.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
