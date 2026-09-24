import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";

// 内容は docs/01_全体設計/02_システム構成.md の「1. 技術スタック」に合わせる
const TECH_STACK = [
  { name: "Next.js", version: "16", usage: "App Router、Server Components / Server Actions" },
  { name: "React", version: "19", usage: "画面の部品。React Compiler 有効" },
  { name: "TypeScript", version: "5", usage: "strict 有効" },
  { name: "Tailwind CSS", version: "4", usage: "スタイリング" },
  { name: "shadcn/ui", version: "4", usage: "Base UI ベースの UI 部品" },
  { name: "TanStack Query", version: "5", usage: "クライアントでの再取得・ポーリング" },
  { name: "Jotai", version: "2", usage: "画面をまたぐクライアントの状態" },
  { name: "React Hook Form + Zod", version: "7 / 4", usage: "フォームと入力チェック" },
  { name: "Vitest", version: "-", usage: "ドメイン層・ユースケースのテスト" },
] as const;

export function TechStackSection() {
  return (
    <section aria-labelledby="tech-stack-heading" className="flex flex-col gap-4">
      <h2 id="tech-stack-heading" className="text-xl font-semibold">
        技術スタック
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TECH_STACK.map((tech) => (
          <li key={tech.name}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{tech.name}</CardTitle>
                <CardAction className="font-mono text-sm text-muted-foreground">
                  {tech.version}
                </CardAction>
                <CardDescription>{tech.usage}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
