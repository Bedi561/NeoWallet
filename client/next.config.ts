import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactRoot: 'concurrent', // Helps with debugging hydration issues
  reactStrictMode: true,
 
};

export default nextConfig;
