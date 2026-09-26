import "server-only";
import type { TechStackItem, TechStackRepository } from "@/server/domain/tech-stack/repository";

// 内容は docs/01_全体設計/02_システム構成.md の「1. 技術スタック」に合わせる（1 行につき 1 つ）
const TECH_STACK: TechStackItem[] = [
  {
    name: "Next.js",
    version: "16",
    usage: "App Router、Server Components / Server Actions",
    url: "https://nextjs.org",
  },
  { name: "React", version: "19", usage: "画面の部品。React Compiler 有効", url: "https://react.dev" },
  { name: "TypeScript", version: "5", usage: "strict 有効", url: "https://www.typescriptlang.org" },
  { name: "Tailwind CSS", version: "4", usage: "スタイリング", url: "https://tailwindcss.com" },
  { name: "shadcn/ui", version: "4", usage: "Base UI ベースの UI 部品", url: "https://ui.shadcn.com" },
  {
    name: "TanStack Query",
    version: "5",
    usage: "クライアントでの再取得・ポーリング",
    url: "https://tanstack.com/query",
  },
  { name: "Jotai", version: "2", usage: "画面をまたぐクライアントの状態", url: "https://jotai.org" },
  { name: "React Hook Form", version: "7", usage: "フォームの入力値の管理", url: "https://react-hook-form.com" },
  { name: "Zod", version: "4", usage: "入力チェック", url: "https://zod.dev" },
  { name: "Vitest", version: "5", usage: "ドメイン層・ユースケースのテスト", url: "https://vitest.dev" },
];

export class InMemoryTechStackRepository implements TechStackRepository {
  async list(): Promise<TechStackItem[]> {
    return TECH_STACK;
  }
}
