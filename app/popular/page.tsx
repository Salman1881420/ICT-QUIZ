'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { AnimeGrid } from '@/components/AnimeGrid';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { IAnimeResult } from '@/types/anime';

export default function PopularPage() {
  const [anime, setAnime] = useState<IAnimeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchPopular(1);
  }, []);

  const fetchPopular = async (page: number) => {
    const isLoadingMore = page > 1;
    if (isLoadingMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(`/api/anime/popular?page=${page}`);
      const data = await response.json();

      if (page === 1) {
        setAnime(data.results || []);
      } else {
        setAnime(prev => [...prev, ...(data.results || [])]);
      }

      setHasNextPage(data.hasNextPage || false);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching popular anime:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (hasNextPage && !loadingMore) {
      fetchPopular(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Star className="w-8 h-8 text-primary-600" />
            Popular Anime
          </h1>
          <p className="text-gray-600">
            Explore the highest-rated and most beloved anime of all time
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimeGrid
            anime={anime}
            loading={loading}
            showDescription={true}
          />

          {hasNextPage && !loading && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={loadMore}
                disabled={loadingMore}
                size="lg"
                className="min-w-[120px]"
              >
                {loadingMore ? <LoadingSpinner size="sm" /> : 'Load More'}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}