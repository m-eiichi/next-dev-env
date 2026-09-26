import "server-only";
import { container } from "@/server/infrastructure/di/container";
import { ListArchitectureLayersUseCase } from "@/server/application/usecase/architecture-layer/list-architecture-layers.usecase";
import type { ArchitectureLayerDto } from "@/server/application/dto/architecture-layer/architecture-layer.dto";

export async function listArchitectureLayers(): Promise<ArchitectureLayerDto[]> {
  // Composition Root: 依存を組み立ててユースケースを作る
  const useCase = new ListArchitectureLayersUseCase(container.architectureLayerRepository());
  return useCase.execute();
}
