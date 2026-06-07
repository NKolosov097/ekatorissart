import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "**.r2.dev" },
    ],
  },
  experimental: {
    optimizePackageImports: ["zustand"],
  },
  // The shop used to live at /shop/originals (and per-locale variants). The
  // new canonical URL is /shop, with detail pages at /shop/[slug]. Keep
  // permanent redirects so old links and indexed URLs don't 404.
  async redirects() {
    return [
      { source: "/shop/originals", destination: "/shop", permanent: true },
      { source: "/shop/originals/:slug", destination: "/shop/:slug", permanent: true },
      { source: "/:locale(ru|ar)/shop/originals", destination: "/:locale/shop", permanent: true },
      { source: "/:locale(ru|ar)/shop/originals/:slug", destination: "/:locale/shop/:slug", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
