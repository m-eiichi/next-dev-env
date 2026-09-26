import type { Note } from "./entity";
import type { NoteTitle } from "./value-objects/note-title";

// 更新（command）に要るものだけを置く。一覧・検索は Query Service
// （src/server/application/query/note/note-query-service.ts。docs/01_全体設計/06_アーキテクチャ.md の「4.3」）
export interface NoteRepository {
  save(note: Note): Promise<void>;
  // 同じタイトルのメモがあるか（前後の空白を除いて比べる）
  existsByTitle(title: NoteTitle): Promise<boolean>;
}
