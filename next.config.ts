import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["postprocessing", "@react-three/postprocessing"],
  reactCompiler: false,
  experimental: {
    optimizePackageImports: ["three"],
  },
};

export default nextConfig;
