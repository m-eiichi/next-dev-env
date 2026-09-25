import "server-only";
import type { ExampleRepository } from "@/server/domain/example/repository";
import type { TechStackRepository } from "@/server/domain/tech-stack/repository";
import { InMemoryExampleRepository } from "@/server/infrastructure/in-memory/example/in-memory-example-repository";
import { InMemoryTechStackRepository } from "@/server/infrastructure/in-memory/tech-stack/in-memory-tech-stack-repository";

/**
 * インターフェースと実装を結びつける。
 * 入口（src/server/entry/）からだけ使う。
 * 呼ぶたびに新しいインスタンスを返す（docs/01_全体設計/06_アーキテクチャ.md の「4.5」）。
 */
export const container = {
  exampleRepository: (): ExampleRepository => new InMemoryExampleRepository(),
  techStackRepository: (): TechStackRepository => new InMemoryTechStackRepository(),
};
