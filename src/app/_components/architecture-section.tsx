import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/molecules/card";
import type { ArchitectureLayerDto } from "@/server/application/dto/architecture-layer/architecture-layer.dto";

export function ArchitectureSection({ layers }: { layers: ArchitectureLayerDto[] }) {
  return (
    <section aria-labelledby="architecture-heading" className="flex flex-col gap-4">
      <h2 id="architecture-heading" className="text-xl font-semibold">
        アーキテクチャ
      </h2>
      <p className="text-sm text-muted-foreground">
        依存は外側から内側への一方向だけにします。ドメイン層はどの層にも依存しません。各層を押すと、説明を見られます。
      </p>
      <ol className="flex flex-col gap-3">
        {layers.map((layer) => (
          <li key={layer.slug}>
            {/* カード全体を、層の説明（SCR-020）へのリンクにする */}
            <Link
              href={`/architecture/${layer.slug}`}
              className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Card className="transition-colors group-hover:bg-muted/50">
                {/* SCR-001 の「2.1 レスポンシブ」: モバイルは縦、sm 以上は横 1 行 */}
                <CardContent className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="font-medium sm:w-56 sm:shrink-0">{layer.name}</span>
                  <code className="font-mono text-sm text-primary sm:w-60 sm:shrink-0">
                    {layer.path}
                  </code>
                  <span className="flex-1 text-sm text-muted-foreground">{layer.role}</span>
                  <ChevronRight
                    aria-hidden="true"
                    className="hidden size-4 shrink-0 self-center text-muted-foreground sm:block"
                  />
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
