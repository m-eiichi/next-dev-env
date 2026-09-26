import "server-only";
import { Note } from "@/server/domain/note/entity";
import { DuplicateNoteTitleError } from "@/server/domain/note/errors";
import type { NoteRepository } from "@/server/domain/note/repository";
import { toNoteDto, type NoteDto } from "@/server/application/dto/note/note.dto";

type CreateNoteInput = {
  title: string;
  body: string | null;
};

// 全員が使える画面なので、認証チェックはしない（docs/03_画面設計/SCR-012_メモ登録.md）
export class CreateNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(input: CreateNoteInput): Promise<NoteDto> {
    // 1. エンティティを作る（タイトル・本文のルールのチェックはエンティティの中で行う）
    const note = Note.create(input);

    // 2. 同じタイトルがあれば登録しない（リポジトリで確かめる業務のルール）
    if (await this.noteRepository.existsByTitle(note.title)) {
      throw new DuplicateNoteTitleError();
    }

    // 3. 保存して、DTO で返す
    await this.noteRepository.save(note);
    return toNoteDto(note);
  }
}
