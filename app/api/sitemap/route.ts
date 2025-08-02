import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://animestream.vercel.app';
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/trending</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/popular</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/recent</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/community</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/settings</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <!-- Genre Pages -->
  ${generateGenreUrls(baseUrl)}
  
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

function generateGenreUrls(baseUrl: string): string {
  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery',
    'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
    'Music', 'Mecha', 'School', 'Historical', 'Military', 'Psychological',
    'Shounen', 'Shoujo', 'Seinen', 'Josei', 'Ecchi', 'Harem', 'Isekai'
  ];
  
  return genres.map(genre => `
  <url>
    <loc>${baseUrl}/search?genre=${encodeURIComponent(genre)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('');
}