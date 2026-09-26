import { DomainError } from "../shared/domain-error";
import { NoteTitle } from "./value-objects/note-title";

const BODY_MAX_LENGTH = 200;

export class Note {
  private constructor(
    readonly id: string,
    readonly title: NoteTitle,
    readonly body: string | null,
  ) {}

  // 新しく作るとき（登録。docs/03_画面設計/SCR-012_メモ登録.md の「5.1」）
  static create(params: { title: string; body: string | null }): Note {
    return new Note(
      crypto.randomUUID(),
      NoteTitle.of(params.title),
      normalizeBody(params.body),
    );
  }

  // 保存されているデータから作り直すとき
  static reconstruct(params: { id: string; title: string; body: string | null }): Note {
    return new Note(params.id, NoteTitle.of(params.title), normalizeBody(params.body));
  }
}

// 本文は 200 文字以内。空白だけなら「本文なし」（null）にする
function normalizeBody(value: string | null): string | null {
  const trimmed = value?.trim() || null;
  if (trimmed !== null && trimmed.length > BODY_MAX_LENGTH) {
    throw new DomainError(`本文は ${BODY_MAX_LENGTH} 文字以内にしてください`);
  }
  return trimmed;
}
