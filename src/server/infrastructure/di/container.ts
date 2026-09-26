import "server-only";
import type { ArchitectureLayerQueryService } from "@/server/application/query/architecture-layer/architecture-layer-query-service";
import type { ExampleQueryService } from "@/server/application/query/example/example-query-service";
import type { GettingStartedStepQueryService } from "@/server/application/query/getting-started/getting-started-step-query-service";
import type { TechStackQueryService } from "@/server/application/query/tech-stack/tech-stack-query-service";
import type { ExampleRepository } from "@/server/domain/example/repository";
import { InMemoryArchitectureLayerQueryService } from "@/server/infrastructure/in-memory/architecture-layer/in-memory-architecture-layer-query-service";
import { InMemoryExampleQueryService } from "@/server/infrastructure/in-memory/example/in-memory-example-query-service";
import { InMemoryExampleRepository } from "@/server/infrastructure/in-memory/example/in-memory-example-repository";
import { InMemoryGettingStartedStepQueryService } from "@/server/infrastructure/in-memory/getting-started/in-memory-getting-started-step-query-service";
import { InMemoryTechStackQueryService } from "@/server/infrastructure/in-memory/tech-stack/in-memory-tech-stack-query-service";

/**
 * インターフェースと実装を結びつける。
 * 入口（src/server/entry/）からだけ使う。
 * 呼ぶたびに新しいインスタンスを返す（docs/01_全体設計/06_アーキテクチャ.md の「4.5」）。
 * 更新（command）はリポジトリ、読み取り（query）は Query Service を返す（CQRS）。
 */
export const container = {
  architectureLayerQueryService: (): ArchitectureLayerQueryService =>
    new InMemoryArchitectureLayerQueryService(),
  exampleQueryService: (): ExampleQueryService => new InMemoryExampleQueryService(),
  exampleRepository: (): ExampleRepository => new InMemoryExampleRepository(),
  gettingStartedStepQueryService: (): GettingStartedStepQueryService =>
    new InMemoryGettingStartedStepQueryService(),
  techStackQueryService: (): TechStackQueryService => new InMemoryTechStackQueryService(),
};
