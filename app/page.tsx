'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimeGrid } from '@/components/AnimeGrid';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { TrendingUp, Star, Clock, Play } from 'lucide-react';
import { IAnimeResult } from '@/types/anime';
import Link from 'next/link';
import Image from 'next/image';
import { getAnimeTitle, getImageUrl } from '@/lib/api';
import { truncateText } from '@/lib/utils';

interface HomePageData {
  trending: IAnimeResult[];
  popular: IAnimeResult[];
  recent: IAnimeResult[];
}

export default function HomePage() {
  const [data, setData] = useState<HomePageData>({
    trending: [],
    popular: [],
    recent: [],
  });
  const [loading, setLoading] = useState(true);
  const [heroAnime, setHeroAnime] = useState<IAnimeResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, popularRes, recentRes] = await Promise.all([
          fetch('/api/anime/trending'),
          fetch('/api/anime/popular'),
          fetch('/api/anime/recent'),
        ]);

        const [trending, popular, recent] = await Promise.all([
          trendingRes.json(),
          popularRes.json(),
          recentRes.json(),
        ]);

        setData({
          trending: trending.results || [],
          popular: popular.results || [],
          recent: recent.results || [],
        });

        // Set hero anime from trending
        if (trending.results && trending.results.length > 0) {
          setHeroAnime(trending.results[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {heroAnime && (
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(heroAnime.cover || heroAnime.image)}
              alt={getAnimeTitle(heroAnime.title)}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          </div>
          
          <div className="relative z-10 flex items-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {getAnimeTitle(heroAnime.title)}
                </h1>
                
                {heroAnime.description && (
                  <p className="text-lg text-gray-200 mb-6">
                    {truncateText(heroAnime.description.replace(/<[^>]*>/g, ''), 200)}
                  </p>
                )}
                
                <div className="flex items-center gap-4 mb-6">
                  {heroAnime.rating && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-white">{(heroAnime.rating / 10).toFixed(1)}</span>
                    </div>
                  )}
                  
                  {heroAnime.totalEpisodes && (
                    <span className="text-gray-300">
                      {heroAnime.totalEpisodes} Episodes
                    </span>
                  )}
                  
                  {heroAnime.releaseDate && (
                    <span className="text-gray-300">
                      {heroAnime.releaseDate}
                    </span>
                  )}
                </div>
                
                <Link href={`/anime/${heroAnime.id}`}>
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Now
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              Trending Now
            </h2>
            <Link href="/trending">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <AnimeGrid
            anime={data.trending.slice(0, 10)}
            loading={false}
          />
        </motion.section>

        {/* Popular Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-6 h-6 text-primary-600" />
              Popular Anime
            </h2>
            <Link href="/popular">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <AnimeGrid
            anime={data.popular.slice(0, 10)}
            loading={false}
          />
        </motion.section>

        {/* Recent Episodes Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary-600" />
              Recent Episodes
            </h2>
            <Link href="/recent">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <AnimeGrid
            anime={data.recent.slice(0, 10)}
            loading={false}
          />
        </motion.section>
      </div>
    </div>
  );
}