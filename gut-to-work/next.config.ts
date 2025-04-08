// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: "/GutToWork",
  output: "export", // Enables static export mode
  trailingSlash: true, // Optional: ensures trailing slash in URLs
  // ...other configuration options if needed
};

export default nextConfig;
