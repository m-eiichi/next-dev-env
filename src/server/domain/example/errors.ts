import { DomainError } from "../shared/domain-error";

// 同じタイトルのサンプルは登録できない（docs/03_画面設計/SCR-012_サンプル登録.md の「5.1」）
export class DuplicateExampleTitleError extends DomainError {
  constructor() {
    super("同じタイトルのサンプルがすでにあります");
  }
}
