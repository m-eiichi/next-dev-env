// Claude Code の hook（PostToolUse、Edit / Write の後）。
// 編集したファイルが src/ の .ts / .tsx なら ESLint をかけ、エラーがあれば Claude に伝える（exit 2）。
// 設定は .claude/settings.json、方針は docs/02_共通設計/08_コーディング規約.md の「4」
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

function readChangedFile() {
  try {
    const input = JSON.parse(readFileSync(0, "utf-8"));
    return input.tool_input?.file_path ?? input.tool_response?.filePath ?? null;
  } catch {
    return null;
  }
}

const file = readChangedFile();
if (!file) {
  process.exit(0);
}

const path = relative(projectDir, resolve(projectDir, file));
if (!/^src\/.+\.tsx?$/.test(path)) {
  process.exit(0);
}

const result = spawnSync("pnpm", ["exec", "eslint", path], {
  cwd: projectDir,
  encoding: "utf-8",
});

if (result.status !== 0) {
  // exit 2 で終わると、stderr の内容が Claude に渡る
  process.stderr.write(`ESLint のエラーがあります（${path}）。直してください。\n${result.stdout}${result.stderr}`);
  process.exit(2);
}
