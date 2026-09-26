import "server-only";
import { container } from "@/server/infrastructure/di/container";
import { ListGettingStartedStepsQuery } from "@/server/application/query/getting-started/list-getting-started-steps.query";
import type { GettingStartedStepDto } from "@/server/application/dto/getting-started/getting-started-step.dto";

export async function listGettingStartedSteps(): Promise<GettingStartedStepDto[]> {
  // Composition Root: 依存を組み立ててクエリを作る
  const query = new ListGettingStartedStepsQuery(container.gettingStartedStepQueryService());
  return query.execute();
}
