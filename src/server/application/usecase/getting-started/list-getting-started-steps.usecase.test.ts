import { describe, expect, it, vi } from "vitest";
import { ListGettingStartedStepsUseCase } from "./list-getting-started-steps.usecase";

// server-only は vitest.config.ts で空のモジュールに置き換えているので、ここでのモックは不要

describe("ListGettingStartedStepsUseCase", () => {
  it("リポジトリの手順を、同じ順番のまま DTO に変換して返す", async () => {
    const repository = {
      list: vi.fn(async () => [
        { label: "インストールする", command: "pnpm install" },
        { label: "起動する", command: "pnpm dev" },
      ]),
    };

    const result = await new ListGettingStartedStepsUseCase(repository).execute();

    expect(repository.list).toHaveBeenCalledOnce();
    expect(result).toEqual([
      { label: "インストールする", command: "pnpm install" },
      { label: "起動する", command: "pnpm dev" },
    ]);
  });

  it("0 件なら空の配列を返す", async () => {
    const result = await new ListGettingStartedStepsUseCase({
      list: vi.fn(async () => []),
    }).execute();

    expect(result).toEqual([]);
  });
});
