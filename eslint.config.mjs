import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// 層どうしの依存のルール（docs/01_全体設計/06_アーキテクチャ.md の「依存の向き」）
// 同じファイルに複数の設定が当たると no-restricted-imports は後のもので丸ごと置き換わるため、
// 1 つのファイルには 1 つの設定だけが当たるように files を分けている

// 層をまたぐ import を禁止するパターン。@/ から書いたものと、相対パスで書いたものの両方を見る
function forbidLayers(layers, message) {
  const names = layers.join("|");
  return [
    { regex: `^@/server/(${names})(/|$)`, message },
    { regex: `^\\.\\.?/(.*/)?(${names})(/|$)`, message },
  ];
}

// バックはフロントに依存しない
const FORBID_FRONT = {
  group: ["@/app/**", "@/components/**", "@/hooks/**"],
  message: "バック（src/server/）からフロントを import しません（ADR-008）。",
};

function restrictImports(files, patterns) {
  return {
    files,
    rules: {
      "no-restricted-imports": ["error", { patterns }],
    },
  };
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // ファイル直下の関数は function で書く。関数の中のアロー関数はよい
  // （docs/02_共通設計/08_コーディング規約.md の「2.1」、docs/04_設計判断/ADR-011_関数の書き方.md）
  {
    rules: {
      // 関数式（const f = function () {}）を禁止する。アロー関数はここでは許し、下で場所を絞る
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            ":matches(Program, Program > ExportNamedDeclaration) > VariableDeclaration > VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)",
          message:
            "ファイル直下の関数は function で書きます（08 コーディング規約の「2.1」）。例: export function Foo() {}",
        },
      ],
    },
  },
  // フロントが src/server/ から import してよいのは、src/server/entry/ の関数と DTO の型だけ
  // （docs/04_設計判断/ADR-008_フロントとバックの分け方.md）
  restrictImports(
    ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}", "src/hooks/**/*.{ts,tsx}"],
    [
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
  ),
  // ドメイン層: どの層にも依存しない。Next.js、React、Zod も import しない
  restrictImports(
    ["src/server/domain/**/*.{ts,tsx}"],
    [
      {
        group: ["next", "next/*", "react", "react/*", "react-dom", "react-dom/*", "zod", "zod/*"],
        message: "ドメイン層では Next.js、React、Zod を import しません（06 アーキテクチャ）。",
      },
      ...forbidLayers(
        ["application", "infrastructure", "entry"],
        "ドメイン層はほかの層に依存しません（06 アーキテクチャ）。",
      ),
      FORBID_FRONT,
    ],
  ),
  // アプリケーション層: ドメイン層のインターフェースだけに依存する
  restrictImports(
    ["src/server/application/**/*.{ts,tsx}"],
    [
      ...forbidLayers(
        ["infrastructure", "entry"],
        "アプリケーション層からインフラストラクチャ層（実装や DI コンテナ）と入口は import しません。依存はコンストラクタで受け取ります（06 アーキテクチャ）。",
      ),
      FORBID_FRONT,
    ],
  ),
  // インフラストラクチャ層: ドメイン層のインターフェースを実装する
  // DTO は import してよい（読むだけの機能では、リポジトリが DTO を直接返してよいため。06 アーキテクチャの「8」）
  restrictImports(
    ["src/server/infrastructure/**/*.{ts,tsx}"],
    [
      ...forbidLayers(
        ["application/usecase", "entry"],
        "インフラストラクチャ層からユースケースと入口は import しません（06 アーキテクチャ）。",
      ),
      FORBID_FRONT,
    ],
  ),
  // 入口: バックのどの層も使ってよいが、フロントには依存しない
  restrictImports(["src/server/entry/**/*.{ts,tsx}"], [FORBID_FRONT]),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // pnpm test:coverage が出力するレポート
    "coverage/**",
  ]),
]);

export default eslintConfig;
