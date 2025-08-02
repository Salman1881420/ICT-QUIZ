/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
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
    ],
    unoptimized: true,
  },
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