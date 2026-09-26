import "server-only";
import { container } from "@/server/infrastructure/di/container";
import { ListArchitectureLayersQuery } from "@/server/application/query/architecture-layer/list-architecture-layers.query";
import type { ArchitectureLayerDto } from "@/server/application/dto/architecture-layer/architecture-layer.dto";

export async function listArchitectureLayers(): Promise<ArchitectureLayerDto[]> {
  // Composition Root: 依存を組み立ててクエリを作る
  const query = new ListArchitectureLayersQuery(container.architectureLayerQueryService());
  return query.execute();
}
