import "server-only";
import { container } from "@/server/infrastructure/di/container";
import { ListTechStackUseCase } from "@/server/application/usecase/tech-stack/list-tech-stack.usecase";
import type { TechStackItemDto } from "@/server/application/dto/tech-stack/tech-stack.dto";

export async function listTechStack(): Promise<TechStackItemDto[]> {
  // Composition Root: 依存を組み立ててユースケースを作る
  const useCase = new ListTechStackUseCase(container.techStackRepository());
  return useCase.execute();
}
