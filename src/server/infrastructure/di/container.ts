import "server-only";
import type { ArchitectureLayerQueryService } from "@/server/application/query/architecture-layer/architecture-layer-query-service";
import type { NoteQueryService } from "@/server/application/query/note/note-query-service";
import type { GettingStartedStepQueryService } from "@/server/application/query/getting-started/getting-started-step-query-service";
import type { TechStackQueryService } from "@/server/application/query/tech-stack/tech-stack-query-service";
import type { TodoQueryService } from "@/server/application/query/todo/todo-query-service";
import type { NoteRepository } from "@/server/domain/note/repository";
import type { TodoRepository } from "@/server/domain/todo/repository";
import { InMemoryArchitectureLayerQueryService } from "@/server/infrastructure/in-memory/architecture-layer/in-memory-architecture-layer-query-service";
import { InMemoryNoteQueryService } from "@/server/infrastructure/in-memory/note/in-memory-note-query-service";
import { InMemoryNoteRepository } from "@/server/infrastructure/in-memory/note/in-memory-note-repository";
import { InMemoryGettingStartedStepQueryService } from "@/server/infrastructure/in-memory/getting-started/in-memory-getting-started-step-query-service";
import { InMemoryTechStackQueryService } from "@/server/infrastructure/in-memory/tech-stack/in-memory-tech-stack-query-service";
import { InMemoryTodoQueryService } from "@/server/infrastructure/in-memory/todo/in-memory-todo-query-service";
import { InMemoryTodoRepository } from "@/server/infrastructure/in-memory/todo/in-memory-todo-repository";

/**
 * インターフェースと実装を結びつける。
 * 入口（src/server/entry/）からだけ使う。
 * 呼ぶたびに新しいインスタンスを返す（docs/01_全体設計/06_アーキテクチャ.md の「4.5」）。
 * 更新（command）はリポジトリ、読み取り（query）は Query Service を返す（CQRS）。
 */
export const container = {
  architectureLayerQueryService: (): ArchitectureLayerQueryService =>
    new InMemoryArchitectureLayerQueryService(),
  noteQueryService: (): NoteQueryService => new InMemoryNoteQueryService(),
  noteRepository: (): NoteRepository => new InMemoryNoteRepository(),
  gettingStartedStepQueryService: (): GettingStartedStepQueryService =>
    new InMemoryGettingStartedStepQueryService(),
  techStackQueryService: (): TechStackQueryService => new InMemoryTechStackQueryService(),
  todoQueryService: (): TodoQueryService => new InMemoryTodoQueryService(),
  todoRepository: (): TodoRepository => new InMemoryTodoRepository(),
};
