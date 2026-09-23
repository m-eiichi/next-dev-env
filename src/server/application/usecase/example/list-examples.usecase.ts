import "server-only";
import type { ExampleRepository } from "@/server/domain/example/repository";
import { toExampleDto, type ExampleDto } from "@/server/application/dto/example/example.dto";

type ListExamplesInput = {
  keyword?: string;
};

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-010_サンプル一覧.md）
export class ListExamplesUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(input: ListExamplesInput = {}): Promise<ExampleDto[]> {
    // 前後の空白は無視し、空なら条件なし（全件）にする
    const keyword = input.keyword?.trim() || undefined;
    const examples = await this.exampleRepository.list({ keyword });
    return examples.map(toExampleDto);
  }
}
