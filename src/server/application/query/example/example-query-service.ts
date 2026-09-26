import type { ExampleDto } from "@/server/application/dto/example/example.dto";

export type ExampleFilter = {
  // タイトルと説明の部分一致（大文字・小文字を区別しない）
  keyword?: string;
};

// 読み取り専用のインターフェース。実装はインフラストラクチャ層
// 新しいものから順に返す
export interface ExampleQueryService {
  list(filter?: ExampleFilter): Promise<ExampleDto[]>;
}
