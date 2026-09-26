import "server-only";
import type { ExampleDto } from "@/server/application/dto/example/example.dto";
import type {
  ExampleFilter,
  ExampleQueryService,
} from "@/server/application/query/example/example-query-service";
import { exampleRows } from "./in-memory-example-store";

// 読み取り側。エンティティを通さず、仮のデータから DTO を直接作る
export class InMemoryExampleQueryService implements ExampleQueryService {
  async list(filter: ExampleFilter = {}): Promise<ExampleDto[]> {
    const keyword = filter.keyword?.toLowerCase();
    const rows = keyword
      ? exampleRows.filter(
          (row) =>
            row.title.toLowerCase().includes(keyword) ||
            (row.description?.toLowerCase().includes(keyword) ?? false),
        )
      : exampleRows;
    return rows.map((row) => ({ id: row.id, title: row.title, description: row.description }));
  }
}
