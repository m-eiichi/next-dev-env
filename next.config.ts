import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 'use cache' / cacheLife / cacheTag を使う（docs/04_設計判断/ADR-012_キャッシュの方式.md）
  cacheComponents: true,
};

export default nextConfig;
