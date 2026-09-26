import { describe, expect, it } from "vitest";
import { InMemoryTechStackRepository } from "./in-memory-tech-stack-repository";

describe("InMemoryTechStackRepository", async () => {
  const items = await new InMemoryTechStackRepository().list();

  it.each(items)("$name の公式サイトの URL が https で始まる", ({ url }) => {
    expect(url).toMatch(/^https:\/\//);
  });

  it("名前が重ならない（カードの key に使うため）", () => {
    const names = items.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
