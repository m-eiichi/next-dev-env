import type { ArchitectureLayer } from "@/server/domain/architecture-layer/repository";

// 画面に渡してよい項目だけを持つプレーンなオブジェクト
export type ArchitectureLayerDto = {
  slug: string;
  name: string;
  path: string;
  role: string;
  does: string[];
  doesNot: string[];
  cannotImport: string[];
  sampleFiles: { path: string; note: string }[];
  codeExamples: { file: string; code: string; points: string[] }[];
  docSection: string;
};

export function toArchitectureLayerDto(layer: ArchitectureLayer): ArchitectureLayerDto {
  // 配列はコピーして渡し、画面側で書き換えてもリポジトリのデータに影響しないようにする
  return {
    slug: layer.slug,
    name: layer.name,
    path: layer.path,
    role: layer.role,
    does: [...layer.does],
    doesNot: [...layer.doesNot],
    cannotImport: [...layer.cannotImport],
    sampleFiles: layer.sampleFiles.map((file) => ({ ...file })),
    codeExamples: layer.codeExamples.map((example) => ({
      ...example,
      points: [...example.points],
    })),
    docSection: layer.docSection,
  };
}
