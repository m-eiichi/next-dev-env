import "server-only";
import type { Example } from "@/server/domain/example/entity";
import type { ExampleRepository } from "@/server/domain/example/repository";
import type { ExampleTitle } from "@/server/domain/example/value-objects/example-title";
import { exampleRows } from "./in-memory-example-store";

// 更新側。エンティティを DB の行の形に変えて、仮のデータ置き場に書き込む
export class InMemoryExampleRepository implements ExampleRepository {
  async save(example: Example): Promise<void> {
    // 新しいものほど先頭に置く
    exampleRows.unshift({
      id: example.id,
      title: example.title.value,
      description: example.description,
    });
  }

  async existsByTitle(title: ExampleTitle): Promise<boolean> {
    return exampleRows.some((row) => row.title.trim() === title.value);
  }
}
