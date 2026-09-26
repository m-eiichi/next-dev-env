import type { GettingStartedStep } from "@/server/domain/getting-started/repository";

// 画面に渡してよい項目だけを持つプレーンなオブジェクト
export type GettingStartedStepDto = {
  label: string;
  command: string;
};

export function toGettingStartedStepDto(step: GettingStartedStep): GettingStartedStepDto {
  return {
    label: step.label,
    command: step.command,
  };
}
