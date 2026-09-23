import "server-only";
import type { ExampleRepository } from "@/server/domain/example/repository";
import { toExampleDto, type ExampleDto } from "@/server/application/dto/example/example.dto";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-010_サンプル一覧.md）
export class ListExamplesUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(): Promise<ExampleDto[]> {
    const examples = await this.exampleRepository.list();
    return examples.map(toExampleDto);
  }
}
