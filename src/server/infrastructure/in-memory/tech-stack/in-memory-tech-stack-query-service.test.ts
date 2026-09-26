import { describe, expect, it } from "vitest";
import { InMemoryTechStackQueryService } from "./in-memory-tech-stack-query-service";

describe("InMemoryTechStackQueryService", async () => {
  const items = await new InMemoryTechStackQueryService().list();

  it.each(items)("$name の公式サイトの URL が https で始まる", ({ url }) => {
    expect(url).toMatch(/^https:\/\//);
  });

  it("名前が重ならない（カードの key に使うため）", () => {
    const names = items.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
