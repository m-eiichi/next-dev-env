// 内容は docs/01_全体設計/06_アーキテクチャ.md の「2. 層の構成」に合わせる
const LAYERS = [
  {
    name: "プレゼンテーション層・入口",
    path: "src/app/",
    role: "画面の表示。Server Component / Server Action / Route Handler で依存を組み立て、ユースケースを呼ぶ",
  },
  {
    name: "アプリケーション層",
    path: "src/application/",
    role: "ユースケース（1 つの操作の手順）。認証・認可のチェックと DTO への変換",
  },
  {
    name: "ドメイン層",
    path: "src/domain/",
    role: "業務のルール。エンティティ、値オブジェクト、リポジトリのインターフェース",
  },
  {
    name: "インフラストラクチャ層",
    path: "src/infrastructure/",
    role: "DB・認証サービスの実装と DI コンテナ",
  },
] as const;

export function ArchitectureSection() {
  return (
    <section aria-labelledby="architecture-heading" className="flex flex-col gap-4">
      <h2 id="architecture-heading" className="text-xl font-semibold">
        アーキテクチャ
      </h2>
      <p className="text-sm text-muted-foreground">
        依存は外側から内側への一方向だけにします。ドメイン層はどの層にも依存しません。
      </p>
      <ol className="flex flex-col gap-3">
        {LAYERS.map((layer) => (
          <li
            key={layer.path}
            className="flex flex-col gap-1 rounded-lg border border-border p-4 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="font-medium sm:w-56 sm:shrink-0">{layer.name}</span>
            <code className="font-mono text-sm text-primary sm:w-40 sm:shrink-0">{layer.path}</code>
            <span className="text-sm text-muted-foreground">{layer.role}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
