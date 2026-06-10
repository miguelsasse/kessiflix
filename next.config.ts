import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silencia o aviso de múltiplos lockfiles (pasta pai tem package.json)
  outputFileTracingRoot: process.cwd(),
  // Não bloquear o build de produção por causa de regras de lint (qualidade de código)
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
