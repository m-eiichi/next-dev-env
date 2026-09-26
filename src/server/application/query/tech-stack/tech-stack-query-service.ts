import type { TechStackItemDto } from "@/server/application/dto/tech-stack/tech-stack.dto";

// 読み取り専用のインターフェース。実装はインフラストラクチャ層
// 技術スタックは更新がないので、ドメイン層は持たない（docs/01_全体設計/06_アーキテクチャ.md の「8」）
export interface TechStackQueryService {
  list(): Promise<TechStackItemDto[]>;
}
