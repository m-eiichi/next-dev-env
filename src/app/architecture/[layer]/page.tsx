import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { ARCHITECTURE_LAYERS, findArchitectureLayer } from "@/app/_components/architecture-layers";

// 5 つの層をビルド時に静的に作る。それ以外の layer は notFound() で 404 にする
// （dynamicParams は cacheComponents を有効にすると使えなくなるので使わない）
export function generateStaticParams() {
  return ARCHITECTURE_LAYERS.map((layer) => ({ layer: layer.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/architecture/[layer]">): Promise<Metadata> {
  const layer = findArchitectureLayer((await params).layer);
  return layer ? { title: layer.name, description: layer.role } : {};
}

// 詳細設計: docs/03_画面設計/SCR-020_層の説明.md
export default async function Page({ params }: PageProps<"/architecture/[layer]">) {
  const layer = findArchitectureLayer((await params).layer);
  if (!layer) {
    notFound();
  }

  const index = ARCHITECTURE_LAYERS.indexOf(layer);
  const previous = ARCHITECTURE_LAYERS[index - 1];
  const next = ARCHITECTURE_LAYERS[index + 1];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">アーキテクチャ</p>
        <h1 className="text-3xl font-semibold tracking-tight">{layer.name}</h1>
        <code className="font-mono text-sm text-primary">{layer.path}</code>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">{layer.role}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <ListCard title="やること" items={layer.does} />
        <ListCard title="やらないこと" items={layer.doesNot} />
        <ListCard
          title="import できないもの（ESLint でチェック）"
          items={layer.cannotImport}
          className="sm:col-span-2"
        />
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>サンプルのファイル</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {layer.sampleFiles.map((file) => (
                <li key={file.path} className="flex flex-col gap-0.5">
                  <code className="font-mono text-sm break-all text-primary">{file.path}</code>
                  <span className="text-muted-foreground">{file.note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="code-examples-heading" className="flex flex-col gap-4">
        <h2 id="code-examples-heading" className="text-xl font-semibold">
          コード例
        </h2>
        {layer.codeExamples.map((example) => (
          <Card key={`${example.file}:${example.code.slice(0, 40)}`}>
            <CardHeader>
              <CardTitle>
                <code className="font-mono text-sm break-all">{example.file}</code>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {/* 長い行は横にスクロールする（画面全体は横にはみ出さない） */}
              <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">
                <code>{example.code}</code>
              </pre>
              <ul className="flex list-disc flex-col gap-1.5 pl-5">
                {example.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <p className="text-sm text-muted-foreground">
        さらに詳しい説明は、
        <code className="font-mono">docs/01_全体設計/06_アーキテクチャ.md</code> の「
        {layer.docSection}」を参照してください。
      </p>

      <nav aria-label="層の移動" className="flex flex-wrap justify-between gap-x-6 gap-y-2">
        <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          ← トップへ戻る
        </Link>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {previous && (
            <Link
              href={`/architecture/${previous.slug}`}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              ← 前の層: {previous.name}
            </Link>
          )}
          {next && (
            <Link
              href={`/architecture/${next.slug}`}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              次の層: {next.name} →
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

function ListCard({
  title,
  items,
  className,
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
