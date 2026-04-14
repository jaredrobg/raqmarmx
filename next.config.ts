import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
    domains: ['images.ctfassets.net'], // dominio de imágenes Contentful
  },
};

export default nextConfig;
