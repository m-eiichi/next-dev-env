import "server-only";
import type { TechStackItemDto } from "@/server/application/dto/tech-stack/tech-stack.dto";
import type { TechStackQueryService } from "./tech-stack-query-service";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-001_トップ.md）
export class ListTechStackQuery {
  constructor(private readonly techStackQueryService: TechStackQueryService) {}

  async execute(): Promise<TechStackItemDto[]> {
    return this.techStackQueryService.list();
  }
}
