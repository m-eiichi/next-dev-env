// Claude Code の hook（PostToolUse、Edit / Write の後）。
// 編集したファイルが AI の仕組み（.claude/、AGENTS.md、CLAUDE.md）なら、資料をそろえるよう Claude に伝える（止めはしない）。
// 設定は .claude/settings.json、方針は docs/05_AI駆動開発/02_仕組み.md の「2.2」
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
// settings.local.json は個人の設定（Git で管理しない）なので、資料には書かない
const isAiSetting =
  (path.startsWith(".claude/") && path !== ".claude/settings.local.json") ||
  path === "AGENTS.md" ||
  path === "CLAUDE.md";
if (!isAiSetting) {
  process.exit(0);
}

// exit 0 で JSON を出すと、additionalContext が Claude に渡る
process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: `AI の仕組み（${path}）を変えました。作業を終える前に、skill update-ai-docs の手順に沿って docs/05_AI駆動開発/ などの資料をそろえてください。`,
    },
  }),
);
