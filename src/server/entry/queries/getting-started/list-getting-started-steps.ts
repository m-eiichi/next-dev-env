import "server-only";
import { container } from "@/server/infrastructure/di/container";
import { ListGettingStartedStepsUseCase } from "@/server/application/usecase/getting-started/list-getting-started-steps.usecase";
import type { GettingStartedStepDto } from "@/server/application/dto/getting-started/getting-started-step.dto";

export async function listGettingStartedSteps(): Promise<GettingStartedStepDto[]> {
  // Composition Root: 依存を組み立ててユースケースを作る
  const useCase = new ListGettingStartedStepsUseCase(container.gettingStartedStepRepository());
  return useCase.execute();
}
