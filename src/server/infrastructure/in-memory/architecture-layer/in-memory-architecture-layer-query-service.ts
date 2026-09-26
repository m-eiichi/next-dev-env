import "server-only";
import type { ArchitectureLayerDto } from "@/server/application/dto/architecture-layer/architecture-layer.dto";
import type { ArchitectureLayerQueryService } from "@/server/application/query/architecture-layer/architecture-layer-query-service";

// 各層の情報。トップ（SCR-001）の「アーキテクチャ」と、層の説明（SCR-020）で使う
// 内容は docs/01_全体設計/06_アーキテクチャ.md に合わせる。資料を変えたら、ここも直す
// codeExamples が実際のファイルとずれていないかは、in-memory-architecture-layer-query-service.test.ts で確かめる
const ARCHITECTURE_LAYERS: ArchitectureLayerDto[] = [
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
      { path: "src/app/notes/page.tsx", note: "取得の関数を呼んで、結果を部品に渡すだけの page" },
      { path: "src/app/notes/_components/note-list.tsx", note: "DTO を受け取って表示するだけの部品" },
      {
        path: "src/app/notes/search/_components/note-search.tsx",
        note: "TanStack Query で /api/internal/ を呼ぶ Client Component",
      },
    ],
    codeExamples: [
      {
        file: "src/app/notes/page.tsx",
        code: `export default async function Page() {
  const notes = await listNotes();`,
        points: [
          "page.tsx は取得の関数（src/server/entry/queries/）を呼ぶだけ。DI コンテナやユースケースは出てこない",
          "受け取るのは DTO の配列なので、そのまま部品に渡せる",
        ],
      },
      {
        file: "src/app/notes/_components/note-list.tsx",
        code: `import type { NoteDto } from "@/server/application/dto/note/note.dto";

export function NoteList({ notes }: { notes: NoteDto[] }) {`,
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
    role: "依存を組み立てて、ユースケース（更新）・クエリ（読み取り）を呼ぶ。取得の関数、Server Action、Route Handler の中身",
    does: [
      "入力の受け取りとバリデーション（Zod）",
      "DI コンテナから実装を取り出し、ユースケース・クエリを組み立てる（Composition Root）",
      "取得の関数はクエリを、Server Action はユースケースを呼び、結果を画面や HTTP の形にする",
      "想定内のエラーを、戻り値・画面遷移・Problem Details（RFC 9457）に変換する",
    ],
    doesNot: ["業務のルールを書く（ドメイン層に書く）", "DB に直接アクセスする"],
    cannotImport: ["フロント（src/app/、src/components/、src/hooks/）"],
    sampleFiles: [
      { path: "src/server/entry/queries/note/list-notes.ts", note: "Server Component から呼ぶ取得の関数（クエリを呼ぶ。キャッシュ付き）" },
      { path: "src/server/entry/actions/note/create-note.ts", note: "フォームから呼ぶ Server Action（ユースケースを呼ぶ）" },
      { path: "src/server/entry/api/internal/notes.ts", note: "画面用の Route Handler の中身" },
      { path: "src/server/entry/api/problem-details.ts", note: "失敗したときのレスポンス（RFC 9457）" },
    ],
    codeExamples: [
      {
        file: "src/server/entry/queries/note/list-notes.ts",
        code: `export async function listNotes(): Promise<NoteDto[]> {
  // データが変わるのは登録（SCR-012）のときだけなので、時間では作り直さず、登録のときにタグで捨てる
  // （docs/03_画面設計/SCR-010_メモ一覧.md の「7.1」、docs/02_共通設計/04_データ取得・更新.md の「2」）
  "use cache";
  cacheLife("max");
  cacheTag("notes");

  // Composition Root: 依存を組み立ててクエリを作る
  const query = new ListNotesQuery(container.noteQueryService());
  return query.execute();
}`,
        points: [
          "読み取り（query）。DI コンテナから Query Service を取り出し、クエリに渡す（Composition Root）。これをしてよいのは入口だけ",
          "キャッシュの指定（'use cache'・cacheLife・cacheTag）も、取得の関数に書く",
        ],
      },
      {
        file: "src/server/entry/actions/note/create-note.ts",
        code: `  // 3. 一覧のキャッシュを捨てて、一覧へ移動する（redirect は try/catch の外で呼ぶ）
  // Server Action では revalidateTag ではなく updateTag（登録した人に古い一覧を見せない）
  updateTag("notes");
  redirect("/notes");`,
        points: [
          "更新（command）。Server Action は入力を Zod でチェックし、ユースケースを呼ぶ",
          "登録したら updateTag で一覧のキャッシュ（cacheTag(\"notes\")）を捨てる。次に一覧を開いたとき、新しいデータで作り直される",
        ],
      },
    ],
    docSection: "4.1 入口",
  },
  {
    slug: "application",
    name: "アプリケーション層",
    path: "src/server/application/",
    role: "更新はユースケース（command）、読み取りはクエリ（query）。認証・認可のチェックと、DTO で返すこと",
    does: [
      "更新（command）と読み取り（query）で、置き場所と書き方を分ける（CQRS）",
      "認証・認可のチェック（読み取りでも省かない）",
      "更新: 1 つの操作の手順を書き、ドメイン層（エンティティ、リポジトリ）を呼ぶ",
      "読み取り: Query Service から DTO を受け取って返す（エンティティは作らない）",
    ],
    doesNot: [
      "業務のルールそのものを書く（エンティティ、値オブジェクトに任せる）",
      "DI コンテナを使う、実装を new する（依存はコンストラクタで受け取る）",
      "command と query の間で import し合う",
    ],
    cannotImport: ["インフラストラクチャ層", "入口", "フロント", "command から query、query から command"],
    sampleFiles: [
      { path: "src/server/application/command/note/create-note.usecase.ts", note: "リポジトリをコンストラクタで受け取るユースケース（更新）" },
      { path: "src/server/application/query/note/list-notes.query.ts", note: "Query Service をコンストラクタで受け取るクエリ（読み取り）" },
      { path: "src/server/application/query/note/note-query-service.ts", note: "Query Service のインターフェース（DTO を返す）" },
      { path: "src/server/application/dto/note/note.dto.ts", note: "画面に渡す DTO" },
    ],
    codeExamples: [
      {
        file: "src/server/application/query/note/list-notes.query.ts",
        code: `export class ListNotesQuery {
  constructor(private readonly noteQueryService: NoteQueryService) {}

  async execute(input: ListNotesInput = {}): Promise<NoteDto[]> {
    // 前後の空白は無視し、空なら条件なし（全件）にする
    const keyword = input.keyword?.trim() || undefined;
    return this.noteQueryService.list({ keyword });
  }
}`,
        points: [
          "読み取り（query）。Query Service はコンストラクタで受け取る。型はインターフェース（NoteQueryService）で、実装は知らない",
          "読み取りはドメイン層を通らず、Query Service から DTO をそのまま受け取る",
          "テストではモックを渡すだけで、DB なしで動かせる（list-notes.query.test.ts）",
        ],
      },
      {
        file: "src/server/application/command/note/create-note.usecase.ts",
        code: `  async execute(input: CreateNoteInput): Promise<NoteDto> {
    // 1. エンティティを作る（タイトル・本文のルールのチェックはエンティティの中で行う）
    const note = Note.create(input);

    // 2. 同じタイトルがあれば登録しない（リポジトリで確かめる業務のルール）
    if (await this.noteRepository.existsByTitle(note.title)) {
      throw new DuplicateNoteTitleError();
    }

    // 3. 保存して、DTO で返す
    await this.noteRepository.save(note);
    return toNoteDto(note);
  }`,
        points: [
          "更新（command）。エンティティとリポジトリ（ドメイン層のインターフェース）を使い、業務のルールを守る",
          "文字数のルールはエンティティ・値オブジェクトに、重複の確認のようにデータを見るルールはユースケースに書く",
          "テストでは、重複があるときに保存しないことも確かめる（create-note.usecase.test.ts）",
        ],
      },
    ],
    docSection: "4.3 アプリケーション層（ユースケースとクエリ）",
  },
  {
    slug: "domain",
    name: "ドメイン層",
    path: "src/server/domain/",
    role: "業務のルール。エンティティ、値オブジェクト、リポジトリのインターフェース（更新に使う）",
    does: [
      "業務のルールを書く（エンティティのメソッド、値オブジェクトのチェック）",
      "リポジトリ（更新に要るものだけ）、外部サービスのインターフェースを定義する",
      "ルール違反を DomainError で表す",
    ],
    doesNot: [
      "Next.js、React、DB クライアント、Zod を使う",
      "外から直接プロパティを書き換えさせる",
      "一覧・検索のためのメソッドをリポジトリに足す（読み取りは Query Service）",
    ],
    cannotImport: ["Next.js、React、Zod", "ほかのすべての層", "フロント"],
    sampleFiles: [
      { path: "src/server/domain/note/entity.ts", note: "エンティティ" },
      { path: "src/server/domain/note/value-objects/note-title.ts", note: "値オブジェクト（タイトルは 1〜100 文字）" },
      { path: "src/server/domain/note/repository.ts", note: "リポジトリのインターフェース（更新に要るものだけ）" },
      { path: "src/server/domain/shared/domain-error.ts", note: "業務エラーの基底クラス" },
    ],
    codeExamples: [
      {
        file: "src/server/domain/note/value-objects/note-title.ts",
        code: `export class NoteTitle {
  private constructor(readonly value: string) {}

  static of(value: string): NoteTitle {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new DomainError("タイトルは必須です");
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new DomainError(\`タイトルは \${MAX_LENGTH} 文字以内にしてください\`);
    }
    return new NoteTitle(trimmed);
  }
}`,
        points: [
          "値オブジェクトは、作るとき（of）にルールをチェックする。ルールに合わない値の NoteTitle は存在できない",
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
    role: "DB・認証サービスの実装（リポジトリと Query Service）と DI コンテナ",
    does: [
      "ドメイン層のリポジトリ（更新）と、アプリケーション層の Query Service（読み取り）のインターフェースを実装する",
      "更新: DB の行とエンティティの変換。読み取り: DB の行から DTO を直接作る",
      "DI コンテナで、インターフェースと実装を結びつける",
      "環境変数（process.env）を読む（ほかの層では読まない）",
    ],
    doesNot: ["ユースケース・クエリや入口を呼ぶ", "業務のルールを書く"],
    cannotImport: ["ユースケース・クエリ", "入口", "フロント（DTO と Query Service のインターフェースは import してよい）"],
    sampleFiles: [
      {
        path: "src/server/infrastructure/in-memory/note/in-memory-note-query-service.ts",
        note: "DB が決まるまでの、メモリ上の仮の Query Service（読み取り）",
      },
      {
        path: "src/server/infrastructure/in-memory/note/in-memory-note-repository.ts",
        note: "DB が決まるまでの、メモリ上の仮のリポジトリ（更新）",
      },
      {
        path: "src/server/infrastructure/in-memory/note/in-memory-note-store.ts",
        note: "メモリ上の仮のデータ（読み取りと更新で共有する）",
      },
      { path: "src/server/infrastructure/di/container.ts", note: "DI コンテナ（呼ぶたびに新しいインスタンスを返す）" },
    ],
    codeExamples: [
      {
        file: "src/server/infrastructure/in-memory/note/in-memory-note-query-service.ts",
        code: `export class InMemoryNoteQueryService implements NoteQueryService {
  async list(filter: NoteFilter = {}): Promise<NoteDto[]> {`,
        points: [
          "アプリケーション層のインターフェース（NoteQueryService）を implements する",
          "読み取りなので、エンティティを作らずに DTO を直接返す",
          "DB が決まったら、同じインターフェースを実装したクラスを作って差し替える",
        ],
      },
      {
        file: "src/server/infrastructure/di/container.ts",
        // 足しても変わらない 1 行だけを載せる（全体を載せると、足すたびにここも直す必要がある）
        code: `noteQueryService: (): NoteQueryService => new InMemoryNoteQueryService(),`,
        points: [
          "インターフェースと実装を結びつけるのはここだけ。差し替えるときも、ここを 1 行直せばよい",
          "呼ぶたびに新しいインスタンスを返す。使い回すと、ユーザーごとの情報が別のユーザーに漏れるおそれがあるため",
        ],
      },
    ],
    docSection: "4.5 インフラストラクチャ層",
  },
];

export class InMemoryArchitectureLayerQueryService implements ArchitectureLayerQueryService {
  async list(): Promise<ArchitectureLayerDto[]> {
    // 定数を書き換えられないように、コピーを返す
    return structuredClone(ARCHITECTURE_LAYERS);
  }
}
