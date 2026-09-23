import type { Example } from "./entity";

export interface ExampleRepository {
  list(): Promise<Example[]>;
}
