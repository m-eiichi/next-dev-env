"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { z } from "zod";
import { container } from "@/server/infrastructure/di/container";
import { CreateNoteUseCase } from "@/server/application/command/note/create-note.usecase";
import type { NoteDto } from "@/server/application/dto/note/note.dto";
import { DomainError } from "@/server/domain/shared/domain-error";
import type { ActionResult } from "../types";

// 画面に出すための形式のチェック。文字数のルールはドメイン層を正とする
// （docs/01_全体設計/06_アーキテクチャ.md の「4.4」の「Zod とドメインのチェックの違い」）
const CreateNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(100, "タイトルは 100 文字以内で入力してください"),
  body: z.string().max(200, "本文は 200 文字以内で入力してください"),
});

// 詳細設計: docs/03_画面設計/SCR-012_メモ登録.md
export async function createNote(
  _prev: ActionResult<NoteDto> | null,
  formData: FormData,
): Promise<ActionResult<NoteDto>> {
  // 1. 入力のバリデーション
  const parsed = CreateNoteSchema.safeParse({
    title: formData.get("title") ?? "",
    body: formData.get("body") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "入力内容を確認してください",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // 2. Composition Root と実行。想定内のエラー（業務のルール違反）だけ戻り値に変換し、想定外のものはそのまま投げる
  try {
    const useCase = new CreateNoteUseCase(container.noteRepository());
    await useCase.execute({
      title: parsed.data.title,
      body: parsed.data.body || null,
    });
  } catch (error) {
    if (error instanceof DomainError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }

  // 3. 一覧のキャッシュを捨てて、一覧へ移動する（redirect は try/catch の外で呼ぶ）
  // Server Action では revalidateTag ではなく updateTag（登録した人に古い一覧を見せない）
  updateTag("notes");
  redirect("/notes");
}
