"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { container } from "@/server/infrastructure/di/container";
import { ReopenTodoUseCase } from "@/server/application/command/todo/reopen-todo.usecase";
import { DomainError } from "@/server/domain/shared/domain-error";
import type { ActionResult } from "../types";

// 行ごとのボタンから、フォームではなく関数として呼ぶ（startTransition の中で呼ぶ）
// 詳細設計: docs/03_画面設計/SCR-030_TODO一覧.md、SCR-031_TODO詳細.md
export async function reopenTodo(id: string): Promise<ActionResult> {
  // 外から直接呼べるので、引数もサーバーでチェックする
  const parsed = z.string().min(1).safeParse(id);
  if (!parsed.success) {
    return { ok: false, message: "TODO が見つかりません" };
  }

  try {
    const useCase = new ReopenTodoUseCase(container.todoRepository());
    await useCase.execute(parsed.data);
  } catch (error) {
    // 想定内のエラー（すでに完了している、見つからない など）だけ戻り値にし、想定外のものはそのまま投げる
    if (error instanceof DomainError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }

  updateTag("todos");
  return { ok: true, data: undefined };
}
