import { CodeBlock } from "@/components/atoms/code-block";
import type { GettingStartedStepDto } from "@/server/application/dto/getting-started/getting-started-step.dto";

export function GettingStartedSection({ steps }: { steps: GettingStartedStepDto[] }) {
  return (
    <section
      aria-labelledby="getting-started-heading"
      className="flex flex-col gap-4"
    >
      <h2 id="getting-started-heading" className="text-xl font-semibold">
        始め方
      </h2>
      <ol className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <li key={step.command} className="flex flex-col gap-2">
            <span className="text-sm">
              {index + 1}. {step.label}
            </span>
            <CodeBlock>{step.command}</CodeBlock>
          </li>
        ))}
      </ol>
    </section>
  );
}
