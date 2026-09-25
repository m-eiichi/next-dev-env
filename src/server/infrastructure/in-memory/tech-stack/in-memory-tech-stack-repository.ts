import "server-only";
import type { TechStackItem, TechStackRepository } from "@/server/domain/tech-stack/repository";

// 内容は docs/01_全体設計/02_システム構成.md の「1. 技術スタック」に合わせる
const TECH_STACK: TechStackItem[] = [
  { name: "Next.js", version: "16", usage: "App Router、Server Components / Server Actions" },
  { name: "React", version: "19", usage: "画面の部品。React Compiler 有効" },
  { name: "TypeScript", version: "5", usage: "strict 有効" },
  { name: "Tailwind CSS", version: "4", usage: "スタイリング" },
  { name: "shadcn/ui", version: "4", usage: "Base UI ベースの UI 部品" },
  { name: "TanStack Query", version: "5", usage: "クライアントでの再取得・ポーリング" },
  { name: "Jotai", version: "2", usage: "画面をまたぐクライアントの状態" },
  { name: "React Hook Form + Zod", version: "7 / 4", usage: "フォームと入力チェック" },
  { name: "Vitest", version: "-", usage: "ドメイン層・ユースケースのテスト" },
];

export class InMemoryTechStackRepository implements TechStackRepository {
  async list(): Promise<TechStackItem[]> {
    return TECH_STACK;
  }
}
