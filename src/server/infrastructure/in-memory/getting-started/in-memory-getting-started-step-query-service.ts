import "server-only";
import type { GettingStartedStepDto } from "@/server/application/dto/getting-started/getting-started-step.dto";
import type { GettingStartedStepQueryService } from "@/server/application/query/getting-started/getting-started-step-query-service";

// 内容はルートの README.md の「始め方」「よく使うコマンド」に合わせる
const STEPS: GettingStartedStepDto[] = [
  { label: "依存パッケージをインストールする", command: "pnpm install" },
  { label: "環境変数のファイルを作る", command: "cp .env.example .env.local" },
  { label: "開発サーバーを起動する", command: "pnpm dev" },
  {
    label: "Pull Request の前に CI と同じチェックを実行する",
    command:
      "pnpm lint && pnpm lint:ls && pnpm typecheck && pnpm test:coverage && pnpm build",
  },
];

export class InMemoryGettingStartedStepQueryService implements GettingStartedStepQueryService {
  async list(): Promise<GettingStartedStepDto[]> {
    // 定数を書き換えられないように、コピーを返す
    return STEPS.map((step) => ({ ...step }));
  }
}
