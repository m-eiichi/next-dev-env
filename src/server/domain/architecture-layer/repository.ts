// アーキテクチャの各層の説明。業務のルールがない、読むだけのデータなので、エンティティと値オブジェクトは作らない
// （docs/01_全体設計/06_アーキテクチャ.md の「8. 小さな機能での省略」）
export type ArchitectureLayer = {
  slug: string;
  name: string;
  path: string;
  role: string;
  does: string[];
  doesNot: string[];
  cannotImport: string[];
  sampleFiles: { path: string; note: string }[];
  // サンプルのファイルから抜き出したコード。code は file の中身の一部とそのまま一致させる
  codeExamples: { file: string; code: string; points: string[] }[];
  // 06 アーキテクチャの中で、詳しく説明している節
  docSection: string;
};

export interface ArchitectureLayerRepository {
  // 外側（フロント）から内側（インフラストラクチャ層）の順に返す
  list(): Promise<ArchitectureLayer[]>;
}
