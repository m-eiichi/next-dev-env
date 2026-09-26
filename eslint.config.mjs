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

const APPLICATION_MESSAGE =
  "アプリケーション層からインフラストラクチャ層（実装や DI コンテナ）と入口は import しません。依存はコンストラクタで受け取ります（06 アーキテクチャ）。";
const CQRS_MESSAGE =
  "更新（command）と読み取り（query）は互いに import しません。共通で使うのは DTO とドメイン層だけです（06 アーキテクチャの「4.3」、ADR-016）。";

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
  // アプリケーション層: ドメイン層とアプリケーション層のインターフェースだけに依存する
  // 更新（command）と読み取り（query）は互いに import しない（CQRS。docs/04_設計判断/ADR-016_CQRS.md）
  restrictImports(
    ["src/server/application/command/**/*.{ts,tsx}"],
    [
      ...forbidLayers(["infrastructure", "entry"], APPLICATION_MESSAGE),
      ...forbidLayers(["application/query"], CQRS_MESSAGE),
      { regex: "^\\.\\.?/(.*/)?query(/|$)", message: CQRS_MESSAGE },
      FORBID_FRONT,
    ],
  ),
  restrictImports(
    ["src/server/application/query/**/*.{ts,tsx}"],
    [
      ...forbidLayers(["infrastructure", "entry"], APPLICATION_MESSAGE),
      ...forbidLayers(["application/command"], CQRS_MESSAGE),
      { regex: "^\\.\\.?/(.*/)?command(/|$)", message: CQRS_MESSAGE },
      FORBID_FRONT,
    ],
  ),
  // DTO: command と query の両方から使うので、どちらにも依存しない
  restrictImports(
    ["src/server/application/dto/**/*.{ts,tsx}"],
    [
      ...forbidLayers(["infrastructure", "entry", "application/command", "application/query"], APPLICATION_MESSAGE),
      FORBID_FRONT,
    ],
  ),
  // インフラストラクチャ層: ドメイン層のリポジトリと、アプリケーション層の Query Service のインターフェースを実装する
  // DTO と Query Service のインターフェースは import してよい。ユースケース・クエリ（*.usecase / *.query）と入口は import しない
  restrictImports(
    ["src/server/infrastructure/**/*.{ts,tsx}"],
    [
      ...forbidLayers(
        ["application/command", "entry"],
        "インフラストラクチャ層からユースケースと入口は import しません（06 アーキテクチャ）。",
      ),
      {
        regex: "^@/server/application/query/.+\\.query$",
        message: "インフラストラクチャ層からクエリは import しません。import してよいのは Query Service のインターフェースと DTO だけです（06 アーキテクチャ）。",
      },
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
