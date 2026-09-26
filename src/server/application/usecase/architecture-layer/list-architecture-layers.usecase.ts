import "server-only";
import type { ArchitectureLayerRepository } from "@/server/domain/architecture-layer/repository";
import {
  toArchitectureLayerDto,
  type ArchitectureLayerDto,
} from "@/server/application/dto/architecture-layer/architecture-layer.dto";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-001_トップ.md、SCR-020_層の説明.md）
export class ListArchitectureLayersUseCase {
  constructor(private readonly architectureLayerRepository: ArchitectureLayerRepository) {}

  async execute(): Promise<ArchitectureLayerDto[]> {
    const layers = await this.architectureLayerRepository.list();
    return layers.map(toArchitectureLayerDto);
  }
}
