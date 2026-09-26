import { ExternalLink } from "lucide-react";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import type { TechStackItemDto } from "@/server/application/dto/tech-stack/tech-stack.dto";

export function TechStackSection({
  techStack,
}: {
  techStack: TechStackItemDto[];
}) {
  return (
    <section
      aria-labelledby="tech-stack-heading"
      className="flex flex-col gap-4"
    >
      <h2 id="tech-stack-heading" className="text-xl font-semibold">
        技術スタック
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {techStack.map((tech) => (
          <li key={tech.name}>
            {/* 外部のサイトなので next/link ではなく <a> を使い、新しいタブで開く */}
            <a
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Card className="h-full transition-colors group-hover:bg-muted/50">
                <CardHeader>
                  <CardTitle>
                    {tech.name}
                    <span className="sr-only">（公式サイト。新しいタブで開きます）</span>
                  </CardTitle>
                  <CardAction>
                    <ExternalLink aria-hidden="true" className="size-4 text-muted-foreground" />
                  </CardAction>
                  <CardDescription>{tech.usage}</CardDescription>
                  <CardDescription>
                    <span className="font-bold">version: </span>
                    {tech.version}
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
