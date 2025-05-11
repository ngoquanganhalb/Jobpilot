import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Tắt kiểm tra ESLint trong quá trình build
  },
};

export default nextConfig;
