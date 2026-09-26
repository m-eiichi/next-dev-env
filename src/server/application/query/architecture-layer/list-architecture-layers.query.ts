import "server-only";
import type { ArchitectureLayerDto } from "@/server/application/dto/architecture-layer/architecture-layer.dto";
import type { ArchitectureLayerQueryService } from "./architecture-layer-query-service";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-001_トップ.md、SCR-020_層の説明.md）
export class ListArchitectureLayersQuery {
  constructor(private readonly architectureLayerQueryService: ArchitectureLayerQueryService) {}

  async execute(): Promise<ArchitectureLayerDto[]> {
    return this.architectureLayerQueryService.list();
  }
}
