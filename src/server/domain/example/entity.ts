import { DomainError } from "../shared/domain-error";
import { ExampleTitle } from "./value-objects/example-title";

const DESCRIPTION_MAX_LENGTH = 200;

export class Example {
  private constructor(
    readonly id: string,
    readonly title: ExampleTitle,
    readonly description: string | null,
  ) {}

  // 新しく作るとき（登録。docs/03_画面設計/SCR-012_サンプル登録.md の「5.1」）
  static create(params: { title: string; description: string | null }): Example {
    return new Example(
      crypto.randomUUID(),
      ExampleTitle.of(params.title),
      normalizeDescription(params.description),
    );
  }

  // 保存されているデータから作り直すとき
  static reconstruct(params: { id: string; title: string; description: string | null }): Example {
    return new Example(params.id, ExampleTitle.of(params.title), normalizeDescription(params.description));
  }
}

// 説明は 200 文字以内。空白だけなら「説明なし」（null）にする
function normalizeDescription(value: string | null): string | null {
  const trimmed = value?.trim() || null;
  if (trimmed !== null && trimmed.length > DESCRIPTION_MAX_LENGTH) {
    throw new DomainError(`説明は ${DESCRIPTION_MAX_LENGTH} 文字以内にしてください`);
  }
  return trimmed;
}
