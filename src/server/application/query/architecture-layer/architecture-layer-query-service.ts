import type { ArchitectureLayerDto } from "@/server/application/dto/architecture-layer/architecture-layer.dto";

// 読み取り専用のインターフェース。実装はインフラストラクチャ層
// 層の説明は更新がないので、ドメイン層は持たない（docs/01_全体設計/06_アーキテクチャ.md の「8」）
export interface ArchitectureLayerQueryService {
  // 外側（フロント）から内側（インフラストラクチャ層）の順に返す
  list(): Promise<ArchitectureLayerDto[]>;
}
