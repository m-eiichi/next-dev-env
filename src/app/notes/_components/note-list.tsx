import type { NoteDto } from "@/server/application/dto/note/note.dto";

export function NoteList({ notes }: { notes: NoteDto[] }) {
  if (notes.length === 0) {
    return <p className="text-sm text-muted-foreground">メモがありません</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {notes.map((note) => (
        <li key={note.id} className="flex flex-col gap-2 rounded-lg border border-border p-4">
          <span className="font-medium">{note.title}</span>
          {note.body && (
            <span className="text-sm text-muted-foreground">{note.body}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
