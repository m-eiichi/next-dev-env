// 技術スタック。業務のルールがない、読むだけのデータなので、エンティティと値オブジェクトは作らない
// （docs/01_全体設計/06_アーキテクチャ.md の「8. 小さな機能での省略」）
export type TechStackItem = {
  name: string;
  version: string;
  usage: string;
  // 公式サイトの URL
  url: string;
};

export interface TechStackRepository {
  list(): Promise<TechStackItem[]>;
}
