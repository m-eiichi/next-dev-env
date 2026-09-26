import { describe, expect, it, vi } from "vitest";
import { ListGettingStartedStepsQuery } from "./list-getting-started-steps.query";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

describe("ListGettingStartedStepsQuery", () => {
  it("Query Service の手順を、同じ順番のまま返す", async () => {
    const steps = [
      { label: "インストールする", command: "pnpm install" },
      { label: "起動する", command: "pnpm dev" },
    ];
    const queryService = { list: vi.fn(async () => steps) };

    const result = await new ListGettingStartedStepsQuery(queryService).execute();

    expect(queryService.list).toHaveBeenCalledOnce();
    expect(result).toEqual(steps);
  });
});
