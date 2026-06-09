import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silencia o aviso de múltiplos lockfiles (pasta pai tem package.json)
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
