"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { container } from "@/server/infrastructure/di/container";
import { CreateTodoUseCase } from "@/server/application/command/todo/create-todo.usecase";
import type { TodoDto } from "@/server/application/dto/todo/todo.dto";
import { DomainError } from "@/server/domain/shared/domain-error";
import type { ActionResult } from "../types";

const CreateTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(100, "タイトルは 100 文字以内で入力してください"),
});

// 詳細設計: docs/03_画面設計/SCR-030_TODO一覧.md
export async function createTodo(
  _prev: ActionResult<TodoDto> | null,
  formData: FormData,
): Promise<ActionResult<TodoDto>> {
  const parsed = CreateTodoSchema.safeParse({ title: formData.get("title") ?? "" });
  if (!parsed.success) {
    return {
      ok: false,
      message: "入力内容を確認してください",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const useCase = new CreateTodoUseCase(container.todoRepository());
    const todo = await useCase.execute(parsed.data);
    updateTag("todos");
    return { ok: true, data: todo };
  } catch (error) {
    if (error instanceof DomainError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }
}
