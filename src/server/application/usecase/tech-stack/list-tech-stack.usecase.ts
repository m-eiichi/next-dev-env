import "server-only";
import type { TechStackRepository } from "@/server/domain/tech-stack/repository";
import {
  toTechStackItemDto,
  type TechStackItemDto,
} from "@/server/application/dto/tech-stack/tech-stack.dto";

// 全員が見られる画面なので、認証チェックはしない（docs/03_画面設計/SCR-001_トップ.md）
export class ListTechStackUseCase {
  constructor(private readonly techStackRepository: TechStackRepository) {}

  async execute(): Promise<TechStackItemDto[]> {
    const items = await this.techStackRepository.list();
    return items.map(toTechStackItemDto);
  }
}
