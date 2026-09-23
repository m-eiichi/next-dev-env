import "server-only";
import type { ExampleRepository } from "@/server/domain/example/repository";
import { InMemoryExampleRepository } from "@/server/infrastructure/in-memory/example/in-memory-example-repository";

/**
 * インターフェースと実装を結びつける。
 * 入口（src/server/entry/）からだけ使う。
 * 呼ぶたびに新しいインスタンスを返す（docs/01_全体設計/06_アーキテクチャ.md の「4.5」）。
 */
export const container = {
  exampleRepository: (): ExampleRepository => new InMemoryExampleRepository(),
};
