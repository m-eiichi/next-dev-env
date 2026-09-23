import "server-only";
import { container } from "@/server/infrastructure/di/container";
import { ListExamplesUseCase } from "@/server/application/usecase/example/list-examples.usecase";
import type { ExampleDto } from "@/server/application/dto/example/example.dto";

export async function listExamples(): Promise<ExampleDto[]> {
  // Composition Root: 依存を組み立ててユースケースを作る
  const useCase = new ListExamplesUseCase(container.exampleRepository());
  return useCase.execute();
}
