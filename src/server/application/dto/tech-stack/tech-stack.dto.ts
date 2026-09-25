import type { TechStackItem } from "@/server/domain/tech-stack/repository";

// 画面に渡してよい項目だけを持つプレーンなオブジェクト
export type TechStackItemDto = {
  name: string;
  version: string;
  usage: string;
};

export function toTechStackItemDto(item: TechStackItem): TechStackItemDto {
  return {
    name: item.name,
    version: item.version,
    usage: item.usage,
  };
}
