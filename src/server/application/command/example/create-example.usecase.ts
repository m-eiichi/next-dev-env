import "server-only";
import { Example } from "@/server/domain/example/entity";
import { DuplicateExampleTitleError } from "@/server/domain/example/errors";
import type { ExampleRepository } from "@/server/domain/example/repository";
import { toExampleDto, type ExampleDto } from "@/server/application/dto/example/example.dto";

type CreateExampleInput = {
  title: string;
  description: string | null;
};

// 全員が使える画面なので、認証チェックはしない（docs/03_画面設計/SCR-012_サンプル登録.md）
export class CreateExampleUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(input: CreateExampleInput): Promise<ExampleDto> {
    // 1. エンティティを作る（タイトル・説明のルールのチェックはエンティティの中で行う）
    const example = Example.create(input);

    // 2. 同じタイトルがあれば登録しない（リポジトリで確かめる業務のルール）
    if (await this.exampleRepository.existsByTitle(example.title)) {
      throw new DuplicateExampleTitleError();
    }

    // 3. 保存して、DTO で返す
    await this.exampleRepository.save(example);
    return toExampleDto(example);
  }
}
