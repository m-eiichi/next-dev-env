import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";

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
      {/* 画面の移動なので <a>（Link）のまま、見た目だけ button にする */}
      <div className="flex flex-wrap gap-3">
        <Link href="/notes" className={buttonVariants({ size: "lg" })}>
          実装の見本（メモ）を見る
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Link>
        <Link href="/todos" className={buttonVariants({ size: "lg", variant: "outline" })}>
          実装の見本（TODO）を見る
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
