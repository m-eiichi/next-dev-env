import "server-only";
import type { NoteDto } from "@/server/application/dto/note/note.dto";
import type { NoteQueryService } from "./note-query-service";

type ListNotesInput = {
  keyword?: string;
};

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-010_メモ一覧.md）
export class ListNotesQuery {
  constructor(private readonly noteQueryService: NoteQueryService) {}

  async execute(input: ListNotesInput = {}): Promise<NoteDto[]> {
    // 前後の空白は無視し、空なら条件なし（全件）にする
    const keyword = input.keyword?.trim() || undefined;
    return this.noteQueryService.list({ keyword });
  }
}
