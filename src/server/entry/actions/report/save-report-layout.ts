"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { container } from "@/server/infrastructure/di/container";
import { SaveReportLayoutUseCase } from "@/server/application/command/report/save-report-layout.usecase";
import type { ReportDto, ReportElementDto } from "@/server/application/dto/report/report.dto";
import { DomainError } from "@/server/domain/shared/domain-error";
import type { ActionResult } from "../types";

// 形（種類ごとの項目と型）だけをチェックする。用紙からはみ出さないことなどのルールはドメイン層を正とする
const Length = z.number().finite();
const ElementSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("text"),
    id: z.string().min(1),
    x: Length,
    y: Length,
    width: Length,
    height: Length,
    text: z.string(),
    fontSize: Length,
    bold: z.boolean(),
    align: z.enum(["left", "center", "right"]),
  }),
  z.object({
    kind: z.literal("rect"),
    id: z.string().min(1),
    x: Length,
    y: Length,
    width: Length,
    height: Length,
    strokeWidth: Length,
    fill: z.enum(["none", "gray"]),
  }),
  z.object({
    kind: z.literal("line"),
    id: z.string().min(1),
    x1: Length,
    y1: Length,
    x2: Length,
    y2: Length,
    strokeWidth: Length,
  }),
]);
const SaveReportLayoutSchema = z.object({
  id: z.string().min(1),
  elements: z.array(ElementSchema),
});

// エディタの [保存] から、フォームではなく関数として呼ぶ（startTransition の中で呼ぶ）
// 詳細設計: docs/03_画面設計/SCR-041_ドキュメントエディタ.md
export async function saveReportLayout(input: {
  id: string;
  elements: ReportElementDto[];
}): Promise<ActionResult<ReportDto>> {
  // 外から直接呼べるので、引数もサーバーでチェックする
  const parsed = SaveReportLayoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "レイアウトの形式が正しくありません" };
  }

  let report: ReportDto;
  try {
    const useCase = new SaveReportLayoutUseCase(container.reportRepository());
    report = await useCase.execute(parsed.data);
  } catch (error) {
    // 想定内のエラー（はみ出し、見つからない など）だけ戻り値にし、想定外のものはそのまま投げる
    if (error instanceof DomainError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }

  updateTag("reports");
  return { ok: true, data: report };
}
