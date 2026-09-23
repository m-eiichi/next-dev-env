import { ExampleTitle } from "./value-objects/example-title";

export class Example {
  private constructor(
    readonly id: string,
    readonly title: ExampleTitle,
    readonly description: string | null,
  ) {}

  // 保存されているデータから作り直すとき
  static reconstruct(params: { id: string; title: string; description: string | null }): Example {
    const description = params.description?.trim() || null;
    return new Example(params.id, ExampleTitle.of(params.title), description);
  }
}
