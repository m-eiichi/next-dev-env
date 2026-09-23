export function HeroSection() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Next.js 開発テンプレート
      </h1>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground">
        DDD とクリーンアーキテクチャの考え方で層を分けた、Next.js App Router
        のプロジェクトテンプレートです。画面の取得は Server Component、更新は
        Server Action で行い、業務のルールはドメイン層に集めます。
      </p>
    </section>
  );
}
