import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // フロントが src/server/ から import してよいのは、src/server/entry/ の関数と DTO の型だけ
  // （docs/04_設計判断/ADR-008_フロントとバックの分け方.md）
  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}", "src/hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^@/server/(?!entry/|application/dto/)",
              message:
                "フロントから import してよいのは src/server/entry/ の関数と DTO の型だけです（ADR-008）。",
            },
            {
              group: ["@/server/application/dto/**"],
              allowTypeImports: true,
              message: "DTO は import type で読み込んでください（ADR-008）。",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
