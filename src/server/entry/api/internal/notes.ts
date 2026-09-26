import "server-only";
import { z } from "zod";
import { container } from "@/server/infrastructure/di/container";
import { ListNotesQuery } from "@/server/application/query/note/list-notes.query";
import type { NoteDto } from "@/server/application/dto/note/note.dto";
import { problemResponse } from "../problem-details";

// 画面（SCR-011 メモ検索）から TanStack Query で呼ぶ。外部には公開しない
// レスポンスの型はフロントと共有する（docs/02_共通設計/04_データ取得・更新.md の「5.3」）
export type ListNotesResponse = { data: NoteDto[] };

const QuerySchema = z.object({
  q: z.string().max(100, "検索語は 100 文字以内で入力してください").optional(),
});

export async function GET(request: Request): Promise<Response> {
  // 1. 入力のバリデーション
  const searchParams = new URL(request.url).searchParams;
  const parsed = QuerySchema.safeParse({ q: searchParams.get("q") ?? undefined });
  if (!parsed.success) {
    return problemResponse({
      status: 400,
      code: "VALIDATION_ERROR",
      detail: "入力内容を確認してください",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  // 2. Composition Root と実行。想定外のエラーは 500 にし、内部の情報は返さない
  try {
    const query = new ListNotesQuery(container.noteQueryService());
    const notes = await query.execute({ keyword: parsed.data.q });
    return Response.json({ data: notes } satisfies ListNotesResponse);
  } catch (error) {
    console.error(error);
    return problemResponse({
      status: 500,
      code: "INTERNAL_ERROR",
      detail: "エラーが発生しました",
    });
  }
}
