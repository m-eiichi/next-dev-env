import "server-only";
import type { NoteDto } from "@/server/application/dto/note/note.dto";
import type {
  NoteFilter,
  NoteQueryService,
} from "@/server/application/query/note/note-query-service";
import { noteRows } from "./in-memory-note-store";

// 読み取り側。エンティティを通さず、仮のデータから DTO を直接作る
export class InMemoryNoteQueryService implements NoteQueryService {
  async list(filter: NoteFilter = {}): Promise<NoteDto[]> {
    const keyword = filter.keyword?.toLowerCase();
    const rows = keyword
      ? noteRows.filter(
          (row) =>
            row.title.toLowerCase().includes(keyword) ||
            (row.body?.toLowerCase().includes(keyword) ?? false),
        )
      : noteRows;
    return rows.map((row) => ({ id: row.id, title: row.title, body: row.body }));
  }
}
