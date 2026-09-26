import "server-only";
import { container } from "@/server/infrastructure/di/container";
import { ListTechStackQuery } from "@/server/application/query/tech-stack/list-tech-stack.query";
import type { TechStackItemDto } from "@/server/application/dto/tech-stack/tech-stack.dto";

export async function listTechStack(): Promise<TechStackItemDto[]> {
  // Composition Root: 依存を組み立ててクエリを作る
  const query = new ListTechStackQuery(container.techStackQueryService());
  return query.execute();
}
