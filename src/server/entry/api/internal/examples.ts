import "server-only";
import { z } from "zod";
import { container } from "@/server/infrastructure/di/container";
import { ListExamplesUseCase } from "@/server/application/usecase/example/list-examples.usecase";
import type { ExampleDto } from "@/server/application/dto/example/example.dto";
import { problemResponse } from "../problem-details";

// 画面（SCR-011 サンプル検索）から TanStack Query で呼ぶ。外部には公開しない
// レスポンスの型はフロントと共有する（docs/02_共通設計/04_データ取得・更新.md の「5.3」）
export type ListExamplesResponse = { data: ExampleDto[] };

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
    const useCase = new ListExamplesUseCase(container.exampleRepository());
    const examples = await useCase.execute({ keyword: parsed.data.q });
    return Response.json({ data: examples } satisfies ListExamplesResponse);
  } catch (error) {
    console.error(error);
    return problemResponse({
      status: 500,
      code: "INTERNAL_ERROR",
      detail: "エラーが発生しました",
    });
  }
}
