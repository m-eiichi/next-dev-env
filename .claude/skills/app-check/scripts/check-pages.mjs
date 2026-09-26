// ビルドしたアプリを起動し、画面を開いて確かめ、必ずサーバーを止める（skill app-check）
// このコンテナには ps / pkill がないので、起動したプロセスのグループごと止める
//
// 使い方（先に pnpm build しておく）:
//   node .claude/skills/app-check/scripts/check-pages.mjs / /notes /todos/todo-1 /todos/none=404
//   node .claude/skills/app-check/scripts/check-pages.mjs --port 3200 /
//
// パスの後ろに =404 を付けると、「404 の中身が出ること」を期待する（付けなければ、正常に表示されることを期待する）
// 期待と違う画面が 1 つでもあれば、終了コード 1 で終わる

import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const port = portIndex === -1 ? 3123 : Number(args[portIndex + 1]);
const targets = args
  .filter((_, index) => portIndex === -1 || (index !== portIndex && index !== portIndex + 1))
  .map((arg) => {
    const [path, expected] = arg.split("=");
    return { path, expected: expected === "404" ? "404" : "ok" };
  });

if (targets.length === 0) {
  console.error("確かめるパスを 1 つ以上渡してください（例: / /notes /todos/none=404）");
  process.exit(2);
}

const baseUrl = `http://localhost:${port}`;

async function isUp() {
  try {
    await fetch(baseUrl, { signal: AbortSignal.timeout(1000) });
    return true;
  } catch {
    return false;
  }
}

if (await isUp()) {
  console.error(`ポート ${port} はすでに使われています。--port で別の番号を渡してください`);
  process.exit(2);
}

// detached で起動すると、pnpm → next のプロセスを 1 つのグループとしてまとめて止められる
const server = spawn("pnpm", ["start"], {
  env: { ...process.env, PORT: String(port) },
  detached: true,
  stdio: ["ignore", "pipe", "pipe"],
});
const logs = [];
server.stdout.on("data", (chunk) => logs.push(chunk.toString()));
server.stderr.on("data", (chunk) => logs.push(chunk.toString()));

function stopServer() {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    // すでに止まっている
  }
}
process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});

let failed = false;
try {
  const deadline = Date.now() + 60_000;
  while (!(await isUp())) {
    if (Date.now() > deadline || server.exitCode !== null) {
      throw new Error(`サーバーが起動しませんでした（pnpm build はしましたか）\n${logs.join("")}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  for (const { path, expected } of targets) {
    const response = await fetch(baseUrl + path, { redirect: "manual" });
    const body = await response.text();
    // <Suspense> の中の notFound() は、ステータスが 200 のまま 404 の中身を送る（ストリーミングで先にヘッダーを送るため）
    const isNotFound = response.status === 404 || body.includes("NEXT_HTTP_ERROR_FALLBACK;404");
    const isRedirect = response.status >= 300 && response.status < 400;
    const actual = response.status >= 500 ? "error" : isNotFound ? "404" : "ok";
    const ok = actual === expected;
    if (!ok) failed = true;

    const detail = isRedirect ? ` → ${response.headers.get("location")}` : actual === "404" ? "（404 の中身）" : "";
    console.log(`${ok ? "OK  " : "NG  "} ${response.status} ${path}${detail}${ok ? "" : `  期待: ${expected}`}`);
  }
} catch (error) {
  failed = true;
  console.error(error instanceof Error ? error.message : error);
} finally {
  stopServer();
}

// サーバー側のエラー（⨯ で始まる行など）があれば出す
const errorLines = logs
  .join("")
  .split("\n")
  .filter((line) => /⨯|Error/.test(line));
if (errorLines.length > 0) {
  console.log("\nサーバーのログにエラーがあります:");
  console.log(errorLines.join("\n"));
}

process.exit(failed ? 1 : 0);
