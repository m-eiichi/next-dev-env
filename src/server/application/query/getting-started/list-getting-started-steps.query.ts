import "server-only";
import type { GettingStartedStepDto } from "@/server/application/dto/getting-started/getting-started-step.dto";
import type { GettingStartedStepQueryService } from "./getting-started-step-query-service";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-001_トップ.md）
export class ListGettingStartedStepsQuery {
  constructor(private readonly gettingStartedStepQueryService: GettingStartedStepQueryService) {}

  async execute(): Promise<GettingStartedStepDto[]> {
    return this.gettingStartedStepQueryService.list();
  }
}
