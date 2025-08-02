import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://animestream.vercel.app'),
  title: {
    default: 'AnimeStream - Watch Anime Online Free | HD Streaming',
    template: '%s | AnimeStream'
  },
  description: 'Watch your favorite anime series and movies online for free in HD quality. Stream the latest episodes with English subtitles and dubs. No ads, no registration required.',
  keywords: [
    'anime streaming',
    'watch anime online',
    'anime free',
    'anime HD',
    'anime subtitles',
    'anime dub',
    'latest anime',
    'anime series',
    'anime movies',
    'crunchyroll alternative',
    'funimation alternative',
    'anime episodes'
  ],
  authors: [{ name: 'AnimeStream Team', url: 'https://animestream.vercel.app' }],
  creator: 'AnimeStream',
  publisher: 'AnimeStream',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'entertainment',
  classification: 'Entertainment',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://animestream.vercel.app',
    siteName: 'AnimeStream',
    title: 'AnimeStream - Watch Anime Online Free | HD Streaming',
    description: 'Stream your favorite anime series and movies online for free in HD quality. Latest episodes with subtitles and dubs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AnimeStream - Watch Anime Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@animestream',
    creator: '@animestream',
    title: 'AnimeStream - Watch Anime Online Free',
    description: 'Stream your favorite anime series and movies online for free in HD quality.',
    images: ['/twitter-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#0ea5e9' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AnimeStream',
  },
  alternates: {
    canonical: 'https://animestream.vercel.app',
    languages: {
      'en-US': 'https://animestream.vercel.app',
      'ja-JP': 'https://animestream.vercel.app/ja',
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    yandex: process.env.YANDEX_VERIFICATION_ID,
    other: {
      'msvalidate.01': process.env.BING_VERIFICATION_ID || '',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://api.consumet.org" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//anilist.co" />
        <link rel="dns-prefetch" href="//cdn.myanimelist.net" />
        <link rel="dns-prefetch" href="//gogocdn.net" />
        
        {/* Service Worker for PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AnimeStream',
              alternateName: 'Anime Streaming Platform',
              url: 'https://animestream.vercel.app',
              description: 'Watch anime online for free in HD quality with subtitles and dubs',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://animestream.vercel.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'AnimeStream',
                url: 'https://animestream.vercel.app',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* Analytics and performance monitoring */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                        page_title: document.title,
                        page_location: window.location.href,
                      });
                    `,
                  }}
                />
              </>
            )}
          </>
        )}
      </body>
    </html>
  );
}