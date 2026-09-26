import { DomainError } from "../shared/domain-error";

// 操作するドキュメントが見つからない（docs/03_画面設計/SCR-041_ドキュメントエディタ.md の「5.1」）
export class ReportNotFoundError extends DomainError {
  constructor() {
    super("ドキュメントが見つかりません");
  }
}
