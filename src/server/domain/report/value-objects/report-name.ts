import { DomainError } from "../../shared/domain-error";

const MAX_LENGTH = 50;

export class ReportName {
  private constructor(readonly value: string) {}

  static of(value: string): ReportName {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new DomainError("ドキュメントの名前は必須です");
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new DomainError(`ドキュメントの名前は ${MAX_LENGTH} 文字以内にしてください`);
    }
    return new ReportName(trimmed);
  }
}
