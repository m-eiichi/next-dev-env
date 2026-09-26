import type { GettingStartedStepDto } from "@/server/application/dto/getting-started/getting-started-step.dto";

// 読み取り専用のインターフェース。実装はインフラストラクチャ層
// 始め方の手順は更新がないので、ドメイン層は持たない（docs/01_全体設計/06_アーキテクチャ.md の「8」）
export interface GettingStartedStepQueryService {
  // 実行する順番に返す
  list(): Promise<GettingStartedStepDto[]>;
}
