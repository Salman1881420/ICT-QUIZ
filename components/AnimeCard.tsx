'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Play, Calendar } from 'lucide-react';
import { IAnimeResult } from '@/types/anime';
import { getAnimeTitle, getImageUrl } from '@/lib/api';
import { formatNumber, truncateText } from '@/lib/utils';

interface AnimeCardProps {
  anime: IAnimeResult;
  showDescription?: boolean;
  className?: string;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  showDescription = false,
  className = '',
}) => {
  const title = getAnimeTitle(anime.title);
  const imageUrl = getImageUrl(anime.image);

  return (
    <Link href={`/anime/${anime.id}`} className={`group ${className}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
          
          {/* Overlay with play button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Rating badge */}
          {anime.rating && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{anime.rating / 10}</span>
            </div>
          )}

          {/* Episode count */}
          {anime.totalEpisodes && (
            <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-md text-xs">
              {anime.totalEpisodes} eps
            </div>
          )}

          {/* Status indicator */}
          {anime.type && (
            <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-md text-xs font-medium">
              {anime.type}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {truncateText(title, 50)}
          </h3>

          {showDescription && anime.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-3">
              {truncateText(anime.description.replace(/<[^>]*>/g, ''), 120)}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            {anime.releaseDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{anime.releaseDate}</span>
              </div>
            )}
            
            {anime.popularity && (
              <div className="text-xs">
                {formatNumber(anime.popularity)} views
              </div>
            )}
          </div>

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {anime.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                >
                  {genre}
                </span>
              ))}
              {anime.genres.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                  +{anime.genres.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};