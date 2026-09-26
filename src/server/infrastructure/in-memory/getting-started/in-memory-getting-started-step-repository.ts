import "server-only";
import type {
  GettingStartedStep,
  GettingStartedStepRepository,
} from "@/server/domain/getting-started/repository";

// 内容はルートの README.md の「始め方」「よく使うコマンド」に合わせる
const STEPS: GettingStartedStep[] = [
  { label: "依存パッケージをインストールする", command: "pnpm install" },
  { label: "環境変数のファイルを作る", command: "cp .env.example .env.local" },
  { label: "開発サーバーを起動する", command: "pnpm dev" },
  {
    label: "Pull Request の前に CI と同じチェックを実行する",
    command:
      "pnpm lint && pnpm lint:ls && pnpm typecheck && pnpm test:coverage && pnpm build",
  },
];

export class InMemoryGettingStartedStepRepository implements GettingStartedStepRepository {
  async list(): Promise<GettingStartedStep[]> {
    return STEPS;
  }
}
