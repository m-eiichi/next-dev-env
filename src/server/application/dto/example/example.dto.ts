import type { Example } from "@/server/domain/example/entity";

// 画面に渡してよい項目だけを持つプレーンなオブジェクト
export type ExampleDto = {
  id: string;
  title: string;
  description: string | null;
};

export function toExampleDto(example: Example): ExampleDto {
  return {
    id: example.id,
    title: example.title.value,
    description: example.description,
  };
}
