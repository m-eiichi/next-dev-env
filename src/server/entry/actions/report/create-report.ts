"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { z } from "zod";
import { container } from "@/server/infrastructure/di/container";
import { CreateReportUseCase } from "@/server/application/command/report/create-report.usecase";
import type { ReportDto } from "@/server/application/dto/report/report.dto";
import { DomainError } from "@/server/domain/shared/domain-error";
import type { ActionResult } from "../types";

// 画面に出すための形式のチェック。文字数のルールはドメイン層を正とする
const CreateReportSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "名前を入力してください")
    .max(50, "名前は 50 文字以内で入力してください"),
});

// 詳細設計: docs/03_画面設計/SCR-040_ドキュメント一覧.md
export async function createReport(
  _prev: ActionResult<ReportDto> | null,
  formData: FormData,
): Promise<ActionResult<ReportDto>> {
  const parsed = CreateReportSchema.safeParse({ name: formData.get("name") ?? "" });
  if (!parsed.success) {
    return {
      ok: false,
      message: "入力内容を確認してください",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  let report: ReportDto;
  try {
    const useCase = new CreateReportUseCase(container.reportRepository());
    report = await useCase.execute(parsed.data);
  } catch (error) {
    if (error instanceof DomainError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }

  // 作ったらすぐ描けるよう、エディタへ移動する（redirect は try/catch の外で呼ぶ）
  updateTag("reports");
  redirect(`/reports/${report.id}`);
}
