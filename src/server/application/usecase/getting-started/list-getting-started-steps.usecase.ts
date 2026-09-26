import "server-only";
import type { GettingStartedStepRepository } from "@/server/domain/getting-started/repository";
import {
  toGettingStartedStepDto,
  type GettingStartedStepDto,
} from "@/server/application/dto/getting-started/getting-started-step.dto";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-001_トップ.md）
export class ListGettingStartedStepsUseCase {
  constructor(private readonly gettingStartedStepRepository: GettingStartedStepRepository) {}

  async execute(): Promise<GettingStartedStepDto[]> {
    const steps = await this.gettingStartedStepRepository.list();
    return steps.map(toGettingStartedStepDto);
  }
}
