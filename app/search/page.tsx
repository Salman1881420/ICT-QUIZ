'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X, Calendar, Star, Clock } from 'lucide-react';
import { AnimeGrid } from '@/components/AnimeGrid';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/Loading';
import { IAnimeResult } from '@/types/anime';
import { debounce } from 'lodash';

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
  'Music', 'Mecha', 'School', 'Historical', 'Military', 'Psychological',
  'Shounen', 'Shoujo', 'Seinen', 'Josei', 'Ecchi', 'Harem', 'Isekai'
];

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const SEASONS = ['Winter', 'Spring', 'Summer', 'Fall'];

const FORMATS = ['TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music'];

const STATUS = ['Releasing', 'Completed', 'Not Yet Released', 'Cancelled', 'Hiatus'];

interface SearchFilters {
  query: string;
  genres: string[];
  year: string;
  season: string;
  format: string;
  status: string;
  sort: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [results, setResults] = useState<IAnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams?.get('q') || '',
    genres: searchParams?.get('genre') ? [searchParams.get('genre')!] : [],
    year: searchParams?.get('year') || '',
    season: '',
    format: '',
    status: '',
    sort: 'popularity',
  });

  const debouncedSearch = useCallback(
    debounce((searchFilters: SearchFilters, page: number = 1) => {
      performSearch(searchFilters, page);
    }, 500),
    []
  );

  useEffect(() => {
    if (filters.query || filters.genres.length > 0 || filters.year) {
      debouncedSearch(filters, 1);
    }
  }, [filters, debouncedSearch]);

  const performSearch = async (searchFilters: SearchFilters, page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchFilters.query) params.append('q', searchFilters.query);
      if (searchFilters.genres.length > 0) params.append('genre', searchFilters.genres[0]);
      if (searchFilters.year) params.append('year', searchFilters.year);
      params.append('page', page.toString());

      const response = await fetch(`/api/anime/search?${params}`);
      const data = await response.json();

      if (page === 1) {
        setResults(data.results || []);
      } else {
        setResults(prev => [...prev, ...(data.results || [])]);
      }
      
      setHasNextPage(data.hasNextPage || false);
      setCurrentPage(page);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleGenreToggle = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      genres: [],
      year: '',
      season: '',
      format: '',
      status: '',
      sort: 'popularity',
    });
    setResults([]);
    router.push('/search');
  };

  const loadMore = () => {
    if (hasNextPage && !loading) {
      debouncedSearch(filters, currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Anime</h1>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for anime..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {(filters.genres.length > 0 || filters.year || filters.season || filters.format || filters.status) && (
                <span className="ml-2 w-2 h-2 bg-primary-600 rounded-full"></span>
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {(filters.genres.length > 0 || filters.year || filters.season || filters.format || filters.status) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.genres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {genre}
                  <button onClick={() => handleGenreToggle(genre)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.year && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {filters.year}
                  <button onClick={() => handleFilterChange('year', '')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.season && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {filters.season}
                  <button onClick={() => handleFilterChange('season', '')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.format && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {filters.format}
                  <button onClick={() => handleFilterChange('format', '')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {filters.status}
                  <button onClick={() => handleFilterChange('status', '')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear all
              </Button>
            </div>
          )}
        </motion.div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any Year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Season Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Season
                </label>
                <select
                  value={filters.season}
                  onChange={(e) => handleFilterChange('season', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any Season</option>
                  {SEASONS.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>

              {/* Format Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select
                  value={filters.format}
                  onChange={(e) => handleFilterChange('format', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any Format</option>
                  {FORMATS.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any Status</option>
                  {STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Genres */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.genres.includes(genre)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="w-4 h-4 inline mr-1" />
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="popularity">Popularity</option>
                <option value="trending">Trending</option>
                <option value="score">Score</option>
                <option value="title">Title</option>
                <option value="start_date">Release Date</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading && results.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                  {filters.query && ` for "${filters.query}"`}
                </p>
              </div>
              
              <AnimeGrid
                anime={results}
                loading={false}
                showDescription={true}
              />

              {/* Load More */}
              {hasNextPage && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    size="lg"
                    className="min-w-[120px]"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Load More'}
                  </Button>
                </div>
              )}
            </>
          ) : !loading && (filters.query || filters.genres.length > 0 || filters.year) ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No results found</div>
              <p className="text-gray-400 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">Start searching</div>
              <p className="text-gray-400">
                Enter a search term or use filters to find anime
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}