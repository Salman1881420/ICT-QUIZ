import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AnimeStream - Watch Anime Online',
  description: 'Stream your favorite anime series and movies online for free. High quality streaming with multiple sources.',
  keywords: 'anime, streaming, watch anime, anime online, anime series, anime movies',
  authors: [{ name: 'AnimeStream' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'AnimeStream - Watch Anime Online',
    description: 'Stream your favorite anime series and movies online for free.',
    type: 'website',
    siteName: 'AnimeStream',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnimeStream - Watch Anime Online',
    description: 'Stream your favorite anime series and movies online for free.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
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
      </body>
    </html>
  );
}