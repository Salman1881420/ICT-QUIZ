/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'gogocdn.net',
      'anilist.co',
      's4.anilist.co',
      'media.kitsu.io',
      'artworks.thetvdb.com',
      'image.tmdb.org',
      'cdn.myanimelist.net',
      'animefire.net',
      'i.animefire.net',
      'anroll.net',
      'animesonline.in',
      'img1.ak.crunchyroll.com',
      'cdn.animenewsnetwork.com',
      'static.crunchyroll.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.anilist.co',
      },
      {
        protocol: 'https',
        hostname: '**.kitsu.io',
      },
      {
        protocol: 'https',
        hostname: '**.myanimelist.net',
      },
      {
        protocol: 'https',
        hostname: '**.crunchyroll.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable static optimization
  trailingSlash: false,
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Experimental features for performance
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true,
        },
      };
    }
    
    return config;
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=300, stale-while-revalidate=60'
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400'
          },
        ],
      },
    ];
  },
  
  // Rewrites for API proxy
  async rewrites() {
    return [
      {
        source: '/api/consumet/:path*',
        destination: 'https://api.consumet.org/:path*',
      },
    ];
  },
};

module.exports = nextConfig;