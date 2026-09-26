import "server-only";
import type { ExampleDto } from "@/server/application/dto/example/example.dto";
import type { ExampleQueryService } from "./example-query-service";

type ListExamplesInput = {
  keyword?: string;
};

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-010_サンプル一覧.md）
export class ListExamplesQuery {
  constructor(private readonly exampleQueryService: ExampleQueryService) {}

  async execute(input: ListExamplesInput = {}): Promise<ExampleDto[]> {
    // 前後の空白は無視し、空なら条件なし（全件）にする
    const keyword = input.keyword?.trim() || undefined;
    return this.exampleQueryService.list({ keyword });
  }
}
