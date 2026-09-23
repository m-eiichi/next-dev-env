import type { ExampleDto } from "@/server/application/dto/example/example.dto";

export function ExampleList({ examples }: { examples: ExampleDto[] }) {
  if (examples.length === 0) {
    return <p className="text-sm text-muted-foreground">サンプルがありません</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {examples.map((example) => (
        <li key={example.id} className="flex flex-col gap-2 rounded-lg border border-border p-4">
          <span className="font-medium">{example.title}</span>
          {example.description && (
            <span className="text-sm text-muted-foreground">{example.description}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
