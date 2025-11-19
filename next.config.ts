import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Tắt kiểm tra ESLint trong quá trình build
  },
  images: {
    domains: ["res.cloudinary.com"],
    // hoặc dùng remotePatterns (chi tiết / linh hoạt hơn)
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;
