'use client';

import React from 'react';
import { IAnimeResult } from '@/types/anime';
import { AnimeCard } from './AnimeCard';
import { AnimeGridSkeleton } from '@/components/ui/Loading';

interface AnimeGridProps {
  anime: IAnimeResult[];
  loading?: boolean;
  className?: string;
  showDescription?: boolean;
}

export const AnimeGrid: React.FC<AnimeGridProps> = ({
  anime,
  loading = false,
  className = '',
  showDescription = false,
}) => {
  if (loading) {
    return <AnimeGridSkeleton />;
  }

  if (!anime || anime.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No anime found</div>
        <p className="text-gray-400">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ${className}`}>
      {anime.map((item) => (
        <AnimeCard
          key={item.id}
          anime={item}
          showDescription={showDescription}
        />
      ))}
    </div>
  );
};