import { CodeBlock } from "@/components/atoms/code-block";
// 内容はルートの README.md の「始め方」「よく使うコマンド」に合わせる
const STEPS = [
  { label: "依存パッケージをインストールする", command: "pnpm install" },
  { label: "環境変数のファイルを作る", command: "cp .env.example .env.local" },
  { label: "開発サーバーを起動する", command: "pnpm dev" },
  {
    label: "Pull Request の前に CI と同じチェックを実行する",
    command:
      "pnpm lint && pnpm lint:ls && pnpm typecheck && pnpm test:coverage && pnpm build",
  },
] as const;

export function GettingStartedSection() {
  return (
    <section
      aria-labelledby="getting-started-heading"
      className="flex flex-col gap-4"
    >
      <h2 id="getting-started-heading" className="text-xl font-semibold">
        始め方
      </h2>
      <ol className="flex flex-col gap-4">
        {STEPS.map((step, index) => (
          <li key={step.command} className="flex flex-col gap-2">
            <span className="text-sm">
              {index + 1}. {step.label}
            </span>
            <CodeBlock>{step.command}</CodeBlock>
          </li>
        ))}
      </ol>
    </section>
  );
}
