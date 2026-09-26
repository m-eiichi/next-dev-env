import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { container } from "@/server/infrastructure/di/container";
import { ListNotesQuery } from "@/server/application/query/note/list-notes.query";
import type { NoteDto } from "@/server/application/dto/note/note.dto";

export async function listNotes(): Promise<NoteDto[]> {
  // データが変わるのは登録（SCR-012）のときだけなので、時間では作り直さず、登録のときにタグで捨てる
  // （docs/03_画面設計/SCR-010_メモ一覧.md の「7.1」、docs/02_共通設計/04_データ取得・更新.md の「2」）
  "use cache";
  cacheLife("max");
  cacheTag("notes");

  // Composition Root: 依存を組み立ててクエリを作る
  const query = new ListNotesQuery(container.noteQueryService());
  return query.execute();
}
