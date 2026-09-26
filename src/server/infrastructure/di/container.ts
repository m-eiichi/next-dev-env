import "server-only";
import type { ArchitectureLayerRepository } from "@/server/domain/architecture-layer/repository";
import type { ExampleRepository } from "@/server/domain/example/repository";
import type { GettingStartedStepRepository } from "@/server/domain/getting-started/repository";
import type { TechStackRepository } from "@/server/domain/tech-stack/repository";
import { InMemoryArchitectureLayerRepository } from "@/server/infrastructure/in-memory/architecture-layer/in-memory-architecture-layer-repository";
import { InMemoryExampleRepository } from "@/server/infrastructure/in-memory/example/in-memory-example-repository";
import { InMemoryGettingStartedStepRepository } from "@/server/infrastructure/in-memory/getting-started/in-memory-getting-started-step-repository";
import { InMemoryTechStackRepository } from "@/server/infrastructure/in-memory/tech-stack/in-memory-tech-stack-repository";

/**
 * インターフェースと実装を結びつける。
 * 入口（src/server/entry/）からだけ使う。
 * 呼ぶたびに新しいインスタンスを返す（docs/01_全体設計/06_アーキテクチャ.md の「4.5」）。
 */
export const container = {
  architectureLayerRepository: (): ArchitectureLayerRepository =>
    new InMemoryArchitectureLayerRepository(),
  exampleRepository: (): ExampleRepository => new InMemoryExampleRepository(),
  gettingStartedStepRepository: (): GettingStartedStepRepository =>
    new InMemoryGettingStartedStepRepository(),
  techStackRepository: (): TechStackRepository => new InMemoryTechStackRepository(),
};
