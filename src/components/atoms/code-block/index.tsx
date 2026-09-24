import { cn } from "@/lib/utils";

type CodeBlockProps = {
  children: React.ReactNode;
  className?: string;
};

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg bg-muted px-4 py-3 font-mono text-sm",
        className,
      )}
    >
      <code>{children}</code>
    </pre>
  );
}
