import "server-only";
import { z } from "zod";
import { container } from "@/server/infrastructure/di/container";
import { ListExamplesUseCase } from "@/server/application/usecase/example/list-examples.usecase";

// 画面（SCR-011 サンプル検索）から TanStack Query で呼ぶ。外部には公開しない
const QuerySchema = z.object({
  q: z.string().max(100, "検索語は 100 文字以内で入力してください").optional(),
});

export async function GET(request: Request): Promise<Response> {
  // 1. 入力のバリデーション
  const searchParams = new URL(request.url).searchParams;
  const parsed = QuerySchema.safeParse({ q: searchParams.get("q") ?? undefined });
  if (!parsed.success) {
    return Response.json({ message: parsed.error.issues[0].message }, { status: 400 });
  }

  // 2. Composition Root
  const useCase = new ListExamplesUseCase(container.exampleRepository());

  // 3. 実行して、レスポンスの形（{ data: T }）にする
  const examples = await useCase.execute({ keyword: parsed.data.q });
  return Response.json({ data: examples });
}
