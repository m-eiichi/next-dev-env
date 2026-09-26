import { DomainError } from "../../shared/domain-error";

const MAX_LENGTH = 100;

export class TodoTitle {
  private constructor(readonly value: string) {}

  static of(value: string): TodoTitle {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new DomainError("タイトルは必須です");
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new DomainError(`タイトルは ${MAX_LENGTH} 文字以内にしてください`);
    }
    return new TodoTitle(trimmed);
  }
}
