'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Play, Calendar, Clock, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { AnimeGrid } from '@/components/AnimeGrid';
import { AnimeInfo, IAnimeEpisode } from '@/types/anime';
import { getAnimeTitle, getImageUrl } from '@/lib/api';
import { formatDuration, truncateText, getSeasonYear } from '@/lib/utils';
import Link from 'next/link';

export default function AnimeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [anime, setAnime] = useState<AnimeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'episodes' | 'details' | 'recommendations'>('episodes');

  const animeId = params?.id as string;

  useEffect(() => {
    if (!animeId) return;

    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`/api/anime/${animeId}`);
        const data = await response.json();
        setAnime(data);
      } catch (error) {
        console.error('Error fetching anime details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

  const handleWatchEpisode = (episode: IAnimeEpisode) => {
    router.push(`/watch/${animeId}/${episode.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Anime not found</h1>
          <p className="text-gray-600 mb-4">The anime you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const title = getAnimeTitle(anime.title);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(anime.cover || anime.image)}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 flex items-end h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex-shrink-0"
              >
                <div className="w-48 h-72 relative rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={getImageUrl(anime.image)}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1"
              >
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {title}
                </h1>

                {anime.description && (
                  <p className="text-lg text-gray-200 mb-6 max-w-3xl">
                    {truncateText(anime.description.replace(/<[^>]*>/g, ''), 300)}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  {anime.rating && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-white font-semibold">
                        {(anime.rating / 10).toFixed(1)}
                      </span>
                    </div>
                  )}

                  {anime.totalEpisodes && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Play className="w-5 h-5" />
                      <span>{anime.totalEpisodes} Episodes</span>
                    </div>
                  )}

                  {anime.duration && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-5 h-5" />
                      <span>{formatDuration(anime.duration)}</span>
                    </div>
                  )}

                  {anime.startDate && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {getSeasonYear(anime.season, anime.startDate.year)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {anime.episodes && anime.episodes.length > 0 && (
                    <Button
                      size="lg"
                      onClick={() => handleWatchEpisode(anime.episodes![0])}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Episode 1
                    </Button>
                  )}
                  
                  {anime.trailer && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => window.open(`https://youtube.com/watch?v=${anime.trailer?.id}`, '_blank')}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Watch Trailer
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {[
            { id: 'episodes', label: 'Episodes', count: anime.episodes?.length },
            { id: 'details', label: 'Details' },
            { id: 'recommendations', label: 'Similar', count: anime.recommendations?.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count && <span className="ml-2 text-xs">({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'episodes' && (
            <div>
              {anime.episodes && anime.episodes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {anime.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                      onClick={() => handleWatchEpisode(episode)}
                    >
                      <div className="relative aspect-video bg-gray-200">
                        {episode.image ? (
                          <Image
                            src={getImageUrl(episode.image)}
                            alt={episode.title || `Episode ${episode.number}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                            <Play className="w-12 h-12 text-gray-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Episode {episode.number}
                        </h3>
                        {episode.title && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {episode.title}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No episodes available</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Synopsis</h3>
                <p className="text-gray-700 leading-relaxed mb-8">
                  {anime.description?.replace(/<[^>]*>/g, '') || 'No description available.'}
                </p>

                {anime.genres && anime.genres.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Genres
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre) => (
                        <Link
                          key={genre}
                          href={`/search?genre=${encodeURIComponent(genre)}`}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Information</h3>
                <div className="space-y-4">
                  {anime.studios && anime.studios.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Studio:</span>
                      <p className="text-gray-600">{anime.studios.join(', ')}</p>
                    </div>
                  )}

                  {anime.status && (
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-600">{anime.status}</p>
                    </div>
                  )}

                  {anime.type && (
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <p className="text-gray-600">{anime.type}</p>
                    </div>
                  )}

                  {anime.totalEpisodes && (
                    <div>
                      <span className="font-medium text-gray-700">Episodes:</span>
                      <p className="text-gray-600">{anime.totalEpisodes}</p>
                    </div>
                  )}

                  {anime.duration && (
                    <div>
                      <span className="font-medium text-gray-700">Duration:</span>
                      <p className="text-gray-600">{formatDuration(anime.duration)}</p>
                    </div>
                  )}

                  {anime.startDate && (
                    <div>
                      <span className="font-medium text-gray-700">Aired:</span>
                      <p className="text-gray-600">
                        {anime.startDate.year && `${anime.startDate.year}`}
                        {anime.endDate?.year && anime.endDate.year !== anime.startDate.year && 
                          ` - ${anime.endDate.year}`}
                      </p>
                    </div>
                  )}

                  {anime.season && (
                    <div>
                      <span className="font-medium text-gray-700">Season:</span>
                      <p className="text-gray-600">{anime.season}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'recommendations' && (
            <div>
              {anime.recommendations && anime.recommendations.length > 0 ? (
                <AnimeGrid
                  anime={anime.recommendations}
                  loading={false}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No recommendations available</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}