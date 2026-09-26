import "server-only";
import type { Note } from "@/server/domain/note/entity";
import type { NoteRepository } from "@/server/domain/note/repository";
import type { NoteTitle } from "@/server/domain/note/value-objects/note-title";
import { noteRows } from "./in-memory-note-store";

// 更新側。エンティティを DB の行の形に変えて、仮のデータ置き場に書き込む
export class InMemoryNoteRepository implements NoteRepository {
  async save(note: Note): Promise<void> {
    // 新しいものほど先頭に置く
    noteRows.unshift({
      id: note.id,
      title: note.title.value,
      body: note.body,
    });
  }

  async existsByTitle(title: NoteTitle): Promise<boolean> {
    return noteRows.some((row) => row.title.trim() === title.value);
  }
}
