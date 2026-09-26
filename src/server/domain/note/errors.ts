import { DomainError } from "../shared/domain-error";

// 同じタイトルのメモは登録できない（docs/03_画面設計/SCR-012_メモ登録.md の「5.1」）
export class DuplicateNoteTitleError extends DomainError {
  constructor() {
    super("同じタイトルのメモがすでにあります");
  }
}
