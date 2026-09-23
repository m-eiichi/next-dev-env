import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // server-only はテストでは空のモジュールに置き換える（docs/02_共通設計/10_テスト.md）
      "server-only": fileURLToPath(new URL("./src/test/server-only-stub.ts", import.meta.url)),
    },
  },
  test: {
    // 初期値は node。コンポーネントのテストはファイルの先頭に `// @vitest-environment jsdom` を書く
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    // テストがまだ 1 つもない状態でも CI を通す
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      // 目標を置くのはドメイン層とユースケースだけ（docs/02_共通設計/10_テスト.md）
      include: ["src/server/domain/**/*.ts", "src/server/application/**/*.ts"],
      exclude: ["**/*.test.ts"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
