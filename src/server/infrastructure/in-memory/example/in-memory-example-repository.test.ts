import { describe, expect, it } from "vitest";
import { Example } from "@/server/domain/example/entity";
import { ExampleTitle } from "@/server/domain/example/value-objects/example-title";
import { InMemoryExampleQueryService } from "./in-memory-example-query-service";
import { InMemoryExampleRepository } from "./in-memory-example-repository";

// 更新（リポジトリ）と読み取り（Query Service）が、同じ仮のデータを共有していることを確かめる
describe("InMemoryExampleRepository", () => {
  it("保存したサンプルが、読み取り側の一覧の先頭に出る", async () => {
    const repository = new InMemoryExampleRepository();
    const example = Example.create({ title: "保存のテスト", description: null });

    await repository.save(example);
    const [first] = await new InMemoryExampleQueryService().list();

    expect(first).toEqual({ id: example.id, title: "保存のテスト", description: null });
  });

  it("同じタイトルがあるかを、前後の空白を除いて確かめる", async () => {
    const repository = new InMemoryExampleRepository();
    await repository.save(Example.create({ title: "重複のテスト", description: null }));

    expect(await repository.existsByTitle(ExampleTitle.of("  重複のテスト  "))).toBe(true);
    expect(await repository.existsByTitle(ExampleTitle.of("まだないタイトル"))).toBe(false);
  });
});
