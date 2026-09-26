import { DomainError } from "../shared/domain-error";

// 操作する TODO が見つからない（docs/03_画面設計/SCR-030_TODO一覧.md の「5.1」）
export class TodoNotFoundError extends DomainError {
  constructor() {
    super("TODO が見つかりません");
  }
}
