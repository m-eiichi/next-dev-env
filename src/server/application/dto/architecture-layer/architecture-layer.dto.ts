// 画面に渡してよい項目だけを持つプレーンなオブジェクト（アーキテクチャの各層の説明）
export type ArchitectureLayerDto = {
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
