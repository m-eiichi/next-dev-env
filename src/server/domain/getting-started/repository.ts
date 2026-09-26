// 始め方の手順。業務のルールがない、読むだけのデータなので、エンティティと値オブジェクトは作らない
// （docs/01_全体設計/06_アーキテクチャ.md の「8. 小さな機能での省略」）
export type GettingStartedStep = {
  label: string;
  command: string;
};

export interface GettingStartedStepRepository {
  // 実行する順番に返す
  list(): Promise<GettingStartedStep[]>;
}
