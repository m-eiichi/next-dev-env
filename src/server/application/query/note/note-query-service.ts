import type { NoteDto } from "@/server/application/dto/note/note.dto";

export type NoteFilter = {
  // タイトルと本文の部分一致（大文字・小文字を区別しない）
  keyword?: string;
};

// 読み取り専用のインターフェース。実装はインフラストラクチャ層
// 新しいものから順に返す
export interface NoteQueryService {
  list(filter?: NoteFilter): Promise<NoteDto[]>;
}
