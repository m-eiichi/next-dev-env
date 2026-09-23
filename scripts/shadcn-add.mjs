#!/usr/bin/env node
/**
 * shadcn add のあと、components/{atoms|molecules}/{name}/index.tsx 構成へ並べ替えるラッパー。
 *
 * 使い方:
 *   pnpm shadcn:add atoms button input
 *   pnpm shadcn:add molecules dialog
 *   pnpm shadcn:add atoms button --overwrite   # すでにあるものを置き換える
 *
 * 流れ:
 *   1. shadcn は components.json の aliases.ui（src/components/ui）にファイルを作る
 *   2. 指定したものは指定した層へ、一緒に入った依存（dialog に対する button など）は atoms へ移す
 *   3. 移したファイルの中の `@/components/ui/xxx` の import を、移動先のパスに書き換える
 *
 * ルールは docs/01_全体設計/05_ディレクトリ構成.md を参照。
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { extname, join } from "node:path";

const LAYERS = ["atoms", "molecules"];
// 依存として一緒に入ったコンポーネントの置き場所
const DEFAULT_LAYER = "atoms";

const root = process.cwd();
const componentsDir = join(root, "src/components");
const stagingDir = join(componentsDir, "ui");

const args = process.argv.slice(2);
const overwrite = args.includes("--overwrite");
const [layer, ...names] = args.filter((a) => a !== "--overwrite");

if (!LAYERS.includes(layer) || names.length === 0) {
  console.error(`Usage: pnpm shadcn:add <${LAYERS.join("|")}> <components...> [--overwrite]`);
  process.exit(1);
}

if (!existsSync(join(root, "components.json"))) {
  console.error("components.json がありません。先に `pnpm shadcn init` を実行してください");
  process.exit(1);
}

// 前回の失敗などで ui/ にファイルが残っていると、どれが今回追加されたものか区別できない
if (listSourceFiles(stagingDir).length > 0) {
  console.error(`${stagingDir} にファイルが残っています。中身を確認して、移動するか消してから実行してください`);
  process.exit(1);
}

// 1. shadcn で追加する（package.json に入っている shadcn を使う）
const add = spawnSync("pnpm", ["exec", "shadcn", "add", ...names, "--yes"], {
  stdio: "inherit",
  shell: false,
});
if (add.status !== 0) {
  process.exit(add.status ?? 1);
}

// 2. 層ごとのフォルダへ移す
for (const file of listSourceFiles(stagingDir)) {
  const name = file.slice(0, -extname(file).length);
  const requested = names.includes(name);
  const existingLayer = findLayer(name);
  const src = join(stagingDir, file);

  if (existingLayer && !(requested && overwrite)) {
    // すでにあるものは、手を入れている可能性があるので残す
    rmSync(src);
    console.log(`skip     ${name}（${existingLayer}/${name} にすでにあります${requested ? "。置き換えるなら --overwrite" : ""}）`);
    continue;
  }
  if (existingLayer) {
    rmSync(join(componentsDir, existingLayer, name), { recursive: true });
  }

  const target = requested ? layer : DEFAULT_LAYER;
  const destDir = join(componentsDir, target, name);
  mkdirSync(destDir, { recursive: true });
  renameSync(src, join(destDir, `index${extname(file)}`));
  console.log(`${existingLayer ? "replace " : "add     "} ${name} -> ${target}/${name}/index${extname(file)}${requested ? "" : "（依存として追加）"}`);
}

if (existsSync(stagingDir) && readdirSync(stagingDir).length === 0) {
  rmSync(stagingDir, { recursive: true });
}

// 3. `@/components/ui/xxx` の import を移動先に書き換える
for (const l of LAYERS) {
  for (const name of listDirs(join(componentsDir, l))) {
    for (const file of listSourceFiles(join(componentsDir, l, name))) {
      const path = join(componentsDir, l, name, file);
      const before = readFileSync(path, "utf8");
      const after = before.replace(/@\/components\/ui\/([a-z0-9-]+)/g, (match, dep) => {
        const depLayer = findLayer(dep);
        if (!depLayer) {
          console.warn(`warn     ${l}/${name}: ${match} の移動先が見つかりません`);
          return match;
        }
        return `@/components/${depLayer}/${dep}`;
      });
      if (after !== before) writeFileSync(path, after);
    }
  }
}

function findLayer(name) {
  return LAYERS.find((l) => existsSync(join(componentsDir, l, name)));
}

function listDirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((e) => statSync(join(dir, e)).isDirectory());
}

function listSourceFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(
    (e) => statSync(join(dir, e)).isFile() && [".ts", ".tsx"].includes(extname(e)),
  );
}
