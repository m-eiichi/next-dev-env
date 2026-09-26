import type { Note } from "@/server/domain/note/entity";

// 画面に渡してよい項目だけを持つプレーンなオブジェクト
export type NoteDto = {
  id: string;
  title: string;
  body: string | null;
};

export function toNoteDto(note: Note): NoteDto {
  return {
    id: note.id,
    title: note.title.value,
    body: note.body,
  };
}
