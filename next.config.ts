import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unhbvkszwhczbjxgetgk.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.metaforge.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '145.223.116.42',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Cache map tiles for 1 year (they are immutable content)
        source: '/imagesmaps/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
