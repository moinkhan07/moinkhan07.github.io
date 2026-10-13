/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export -> deployable straight to GitHub Pages (moinkhan07.github.io)
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
