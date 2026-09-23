import type { Example } from "./entity";

export type ExampleFilter = {
  // タイトルと説明の部分一致（大文字・小文字を区別しない）
  keyword?: string;
};

export interface ExampleRepository {
  list(filter?: ExampleFilter): Promise<Example[]>;
}
