import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  basePath: isGithubPages ? "/codex" : undefined,
  assetPrefix: isGithubPages ? "/codex/" : undefined
};

export default nextConfig;
