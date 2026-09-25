// 各層の情報。トップ（SCR-001）の「アーキテクチャ」と、層の説明（SCR-020）で使う
// 内容は docs/01_全体設計/06_アーキテクチャ.md に合わせる。資料を変えたら、ここも直す

export type ArchitectureLayer = {
  slug: string;
  name: string;
  path: string;
  role: string;
  does: string[];
  doesNot: string[];
  cannotImport: string[];
  sampleFiles: { path: string; note: string }[];
  // サンプルのファイルから抜き出したコード。code は file の中身の一部とそのまま一致させる
  // （architecture-layers.test.ts で、実際のファイルに含まれているかを確かめる）
  codeExamples: { file: string; code: string; points: string[] }[];
  // 06 アーキテクチャの中で、詳しく説明している節
  docSection: string;
};

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    slug: "presentation",
    name: "プレゼンテーション層（フロント）",
    path: "src/app/",
    role: "画面の表示とユーザーの操作の受け付け。src/components/、src/hooks/ も含む",
    does: [
      "画面の表示と、ユーザーの操作の受け付け",
      "UI だけに関する状態の管理（開閉、選択中のタブなど。画面をまたぐものは Jotai）",
      "page.tsx は取得の関数を呼び、結果を部品に渡すだけにする",
    ],
    doesNot: [
      "依存を組み立てる（入口の役割）",
      "エンティティを props で受け取る（DTO を受け取る）",
      "fetch('/api/...') で自前の API を呼ぶ（TanStack Query で /api/internal/ を呼ぶ場合を除く）",
    ],
    cannotImport: ["src/server/ のうち、src/server/entry/ と DTO の型以外"],
    sampleFiles: [
      { path: "src/app/example/page.tsx", note: "取得の関数を呼んで、結果を部品に渡すだけの page" },
      { path: "src/app/example/_components/example-list.tsx", note: "DTO を受け取って表示するだけの部品" },
      {
        path: "src/app/example/search/_components/example-search.tsx",
        note: "TanStack Query で /api/internal/ を呼ぶ Client Component",
      },
    ],
    codeExamples: [
      {
        file: "src/app/example/page.tsx",
        code: `export default async function Page() {
  const examples = await listExamples();`,
        points: [
          "page.tsx は取得の関数（src/server/entry/queries/）を呼ぶだけ。DI コンテナやユースケースは出てこない",
          "受け取るのは DTO の配列なので、そのまま部品に渡せる",
        ],
      },
      {
        file: "src/app/example/_components/example-list.tsx",
        code: `import type { ExampleDto } from "@/server/application/dto/example/example.dto";

export function ExampleList({ examples }: { examples: ExampleDto[] }) {`,
        points: [
          "部品は DTO を props で受け取り、表示するだけ",
          "DTO は import type で読み込む。値として読み込むと ESLint のエラーになる",
        ],
      },
    ],
    docSection: "4.2 プレゼンテーション層",
  },
  {
    slug: "entry",
    name: "入口",
    path: "src/server/entry/",
    role: "依存を組み立ててユースケースを呼ぶ。取得の関数、Server Action、Route Handler の中身",
    does: [
      "入力の受け取りとバリデーション（Zod）",
      "DI コンテナから実装を取り出し、ユースケースを組み立てる（Composition Root）",
      "ユースケースを実行し、結果を画面や HTTP の形にする",
      "想定内のエラーを、戻り値・画面遷移・Problem Details（RFC 9457）に変換する",
    ],
    doesNot: ["業務のルールを書く（ドメイン層に書く）", "DB に直接アクセスする"],
    cannotImport: ["フロント（src/app/、src/components/、src/hooks/）"],
    sampleFiles: [
      { path: "src/server/entry/queries/example/list-examples.ts", note: "Server Component から呼ぶ取得の関数" },
      { path: "src/server/entry/api/internal/examples.ts", note: "画面用の Route Handler の中身" },
      { path: "src/server/entry/api/problem-details.ts", note: "失敗したときのレスポンス（RFC 9457）" },
    ],
    codeExamples: [
      {
        file: "src/server/entry/queries/example/list-examples.ts",
        code: `import "server-only";
import { container } from "@/server/infrastructure/di/container";
import { ListExamplesUseCase } from "@/server/application/usecase/example/list-examples.usecase";
import type { ExampleDto } from "@/server/application/dto/example/example.dto";

export async function listExamples(): Promise<ExampleDto[]> {
  // Composition Root: 依存を組み立ててユースケースを作る
  const useCase = new ListExamplesUseCase(container.exampleRepository());
  return useCase.execute();
}`,
        points: [
          "DI コンテナから実装を取り出し、ユースケースに渡す（Composition Root）。これをしてよいのは入口だけ",
          "先頭の import \"server-only\" で、Client Component から読み込むとビルドエラーになるようにしている",
          "返すのは DTO。エンティティは入口の外に出さない",
        ],
      },
    ],
    docSection: "4.1 入口",
  },
  {
    slug: "application",
    name: "アプリケーション層",
    path: "src/server/application/",
    role: "ユースケース（1 つの操作の手順）。認証・認可のチェックと DTO への変換",
    does: [
      "1 つの操作の手順を書く（1 ユースケース = 1 クラス）",
      "認証・認可のチェック",
      "ドメイン層の呼び出し",
      "結果を DTO に変換して返す",
    ],
    doesNot: [
      "業務のルールそのものを書く（エンティティ、値オブジェクトに任せる）",
      "DI コンテナを使う、実装を new する（依存はコンストラクタで受け取る）",
    ],
    cannotImport: ["インフラストラクチャ層", "入口", "フロント"],
    sampleFiles: [
      {
        path: "src/server/application/usecase/example/list-examples.usecase.ts",
        note: "リポジトリをコンストラクタで受け取るユースケース",
      },
      { path: "src/server/application/dto/example/example.dto.ts", note: "画面に渡す DTO と、エンティティからの変換" },
    ],
    codeExamples: [
      {
        file: "src/server/application/usecase/example/list-examples.usecase.ts",
        code: `export class ListExamplesUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(input: ListExamplesInput = {}): Promise<ExampleDto[]> {
    // 前後の空白は無視し、空なら条件なし（全件）にする
    const keyword = input.keyword?.trim() || undefined;
    const examples = await this.exampleRepository.list({ keyword });
    return examples.map(toExampleDto);
  }
}`,
        points: [
          "リポジトリはコンストラクタで受け取る。型はドメイン層のインターフェース（ExampleRepository）で、実装は知らない",
          "そのため、テストではモックを渡すだけで DB なしで動かせる（list-examples.usecase.test.ts）",
          "最後に DTO に変換して返す",
        ],
      },
    ],
    docSection: "4.3 アプリケーション層（ユースケース）",
  },
  {
    slug: "domain",
    name: "ドメイン層",
    path: "src/server/domain/",
    role: "業務のルール。エンティティ、値オブジェクト、リポジトリのインターフェース",
    does: [
      "業務のルールを書く（エンティティのメソッド、値オブジェクトのチェック）",
      "リポジトリ、外部サービスのインターフェースを定義する",
      "ルール違反を DomainError で表す",
    ],
    doesNot: [
      "Next.js、React、DB クライアント、Zod を使う",
      "外から直接プロパティを書き換えさせる",
    ],
    cannotImport: ["Next.js、React、Zod", "ほかのすべての層", "フロント"],
    sampleFiles: [
      { path: "src/server/domain/example/entity.ts", note: "エンティティ" },
      { path: "src/server/domain/example/value-objects/example-title.ts", note: "値オブジェクト（タイトルは 1〜100 文字）" },
      { path: "src/server/domain/example/repository.ts", note: "リポジトリのインターフェース" },
      { path: "src/server/domain/shared/domain-error.ts", note: "業務エラーの基底クラス" },
    ],
    codeExamples: [
      {
        file: "src/server/domain/example/value-objects/example-title.ts",
        code: `export class ExampleTitle {
  private constructor(readonly value: string) {}

  static of(value: string): ExampleTitle {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new DomainError("タイトルは必須です");
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new DomainError(\`タイトルは \${MAX_LENGTH} 文字以内にしてください\`);
    }
    return new ExampleTitle(trimmed);
  }
}`,
        points: [
          "値オブジェクトは、作るとき（of）にルールをチェックする。ルールに合わない値の ExampleTitle は存在できない",
          "ルール違反は DomainError で表す",
          "Next.js も React も Zod も使っていない、ただの TypeScript のクラス",
        ],
      },
    ],
    docSection: "4.4 ドメイン層",
  },
  {
    slug: "infrastructure",
    name: "インフラストラクチャ層",
    path: "src/server/infrastructure/",
    role: "DB・認証サービスの実装と DI コンテナ",
    does: [
      "ドメイン層のインターフェースを実装する（DB、認証サービス、外部 API）",
      "DB の行とエンティティの変換",
      "DI コンテナで、インターフェースと実装を結びつける",
      "環境変数（process.env）を読む（ほかの層では読まない）",
    ],
    doesNot: ["ユースケースや入口を呼ぶ", "業務のルールを書く"],
    cannotImport: ["ユースケース", "入口", "フロント（DTO は import してよい）"],
    sampleFiles: [
      {
        path: "src/server/infrastructure/in-memory/example/in-memory-example-repository.ts",
        note: "DB が決まるまでの、メモリ上の仮のリポジトリ",
      },
      { path: "src/server/infrastructure/di/container.ts", note: "DI コンテナ（呼ぶたびに新しいインスタンスを返す）" },
    ],
    codeExamples: [
      {
        file: "src/server/infrastructure/in-memory/example/in-memory-example-repository.ts",
        code: `export class InMemoryExampleRepository implements ExampleRepository {
  async list(filter: ExampleFilter = {}): Promise<Example[]> {`,
        points: [
          "ドメイン層のインターフェース（ExampleRepository）を implements する",
          "DB が決まったら、同じインターフェースを実装したクラスを作って差し替える",
        ],
      },
      {
        file: "src/server/infrastructure/di/container.ts",
        code: `export const container = {
  exampleRepository: (): ExampleRepository => new InMemoryExampleRepository(),
  techStackRepository: (): TechStackRepository => new InMemoryTechStackRepository(),
};`,
        points: [
          "インターフェースと実装を結びつけるのはここだけ。差し替えるときも、ここを 1 行直せばよい",
          "呼ぶたびに新しいインスタンスを返す。使い回すと、ユーザーごとの情報が別のユーザーに漏れるおそれがあるため",
        ],
      },
    ],
    docSection: "4.5 インフラストラクチャ層",
  },
];

export function findArchitectureLayer(slug: string): ArchitectureLayer | undefined {
  return ARCHITECTURE_LAYERS.find((layer) => layer.slug === slug);
}
