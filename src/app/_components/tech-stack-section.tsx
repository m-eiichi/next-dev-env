import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import type { TechStackItemDto } from "@/server/application/dto/tech-stack/tech-stack.dto";

export function TechStackSection({ techStack }: { techStack: TechStackItemDto[] }) {
  return (
    <section aria-labelledby="tech-stack-heading" className="flex flex-col gap-4">
      <h2 id="tech-stack-heading" className="text-xl font-semibold">
        技術スタック
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {techStack.map((tech) => (
          <li key={tech.name}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{tech.name}</CardTitle>
                <CardAction className="font-mono text-sm text-muted-foreground">
                  {tech.version}
                </CardAction>
                <CardDescription>{tech.usage}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
