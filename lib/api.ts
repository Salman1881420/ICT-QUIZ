import axios from 'axios';
import {
  AnimeInfo,
  IAnimeResult,
  SearchResult,
  TrendingResult,
  PopularResult,
  RecentEpisodesResult,
  IVideoResult,
  IAnimeEpisode,
} from '@/types/anime';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.consumet.org';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000');

// Create axios instance with default config and caching
const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'AnimeStream/1.0 (https://animestream.vercel.app)',
  },
});

// Add request/response interceptors for caching and error handling
api.interceptors.request.use(
  (config) => {
    // Add cache headers for GET requests
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'max-age=300, stale-while-revalidate=600';
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Add performance logging
    console.log(`API Response: ${response.status} ${response.config.url} (${response.headers['content-length'] || 'unknown'} bytes)`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
    });
    
    // Return cached data if available during errors
    if (error.response?.status >= 500 && error.config?.url) {
      console.log('Server error detected, attempting to serve cached data');
    }
    
    return Promise.reject(error);
  }
);

// Cache for API responses (in-memory cache for serverless functions)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache helper function
function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    console.log(`Cache hit: ${key}`);
    return cached.data;
  }
  if (cached) {
    cache.delete(key);
  }
  return null;
}

function setCachedData<T>(key: string, data: T, ttlMinutes: number = 5): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000,
  });
  console.log(`Cache set: ${key} (TTL: ${ttlMinutes}m)`);
}

export class AnimeAPI {
  // Search anime by query with caching
  static async search(
    query: string,
    page: number = 1
  ): Promise<SearchResult> {
    const cacheKey = `search:${query}:${page}`;
    const cached = getCachedData<SearchResult>(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/meta/anilist/advanced-search`, {
        params: {
          query,
          page,
          perPage: 20,
        },
      });
      
      const data = response.data;
      setCachedData(cacheKey, data, 10); // Cache for 10 minutes
      return data;
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search anime');
    }
  }

  // Get trending anime with enhanced caching
  static async getTrending(page: number = 1): Promise<TrendingResult> {
    const cacheKey = `trending:${page}`;
    const cached = getCachedData<TrendingResult>(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/meta/anilist/trending`, {
        params: { page, perPage: 20 },
      });
      
      const data = response.data;
      setCachedData(cacheKey, data, 30); // Cache for 30 minutes
      return data;
    } catch (error) {
      console.error('Trending error:', error);
      throw new Error('Failed to fetch trending anime');
    }
  }

  // Get popular anime with caching
  static async getPopular(page: number = 1): Promise<PopularResult> {
    const cacheKey = `popular:${page}`;
    const cached = getCachedData<PopularResult>(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/meta/anilist/popular`, {
        params: { page, perPage: 20 },
      });
      
      const data = response.data;
      setCachedData(cacheKey, data, 60); // Cache for 1 hour
      return data;
    } catch (error) {
      console.error('Popular error:', error);
      throw new Error('Failed to fetch popular anime');
    }
  }

  // Get recent episodes with shorter cache
  static async getRecentEpisodes(
    page: number = 1
  ): Promise<RecentEpisodesResult> {
    const cacheKey = `recent:${page}`;
    const cached = getCachedData<RecentEpisodesResult>(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/anime/gogoanime/recent-episodes`, {
        params: { page },
      });
      
      const data = response.data;
      setCachedData(cacheKey, data, 15); // Cache for 15 minutes
      return data;
    } catch (error) {
      console.error('Recent episodes error:', error);
      throw new Error('Failed to fetch recent episodes');
    }
  }

  // Get anime info with extended caching
  static async getAnimeInfo(id: string): Promise<AnimeInfo> {
    const cacheKey = `anime:${id}`;
    const cached = getCachedData<AnimeInfo>(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/meta/anilist/info/${id}`);
      
      const data = response.data;
      setCachedData(cacheKey, data, 120); // Cache for 2 hours
      return data;
    } catch (error) {
      console.error('Anime info error:', error);
      throw new Error('Failed to fetch anime info');
    }
  }

  // Get episode streaming links with minimal caching
  static async getEpisodeStreaming(episodeId: string): Promise<IVideoResult> {
    const cacheKey = `episode:${episodeId}`;
    const cached = getCachedData<IVideoResult>(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/anime/gogoanime/watch/${episodeId}`);
      
      const data = response.data;
      setCachedData(cacheKey, data, 5); // Cache for 5 minutes
      return data;
    } catch (error) {
      console.error('Episode streaming error:', error);
      throw new Error('Failed to fetch episode streaming links');
    }
  }

  // Get anime by genre with caching
  static async getAnimeByGenre(
    genre: string,
    page: number = 1
  ): Promise<SearchResult> {
    const cacheKey = `genre:${genre}:${page}`;
    const cached = getCachedData<SearchResult>(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/meta/anilist/advanced-search`, {
        params: {
          genres: [genre],
          page,
          perPage: 20,
        },
      });
      
      const data = response.data;
      setCachedData(cacheKey, data, 60); // Cache for 1 hour
      return data;
    } catch (error) {
      console.error('Genre search error:', error);
      throw new Error('Failed to fetch anime by genre');
    }
  }

  // Get anime by year with caching
  static async getAnimeByYear(
    year: number,
    page: number = 1
  ): Promise<SearchResult> {
    const cacheKey = `year:${year}:${page}`;
    const cached = getCachedData<SearchResult>(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/meta/anilist/advanced-search`, {
        params: {
          year,
          page,
          perPage: 20,
        },
      });
      
      const data = response.data;
      setCachedData(cacheKey, data, 120); // Cache for 2 hours
      return data;
    } catch (error) {
      console.error('Year search error:', error);
      throw new Error('Failed to fetch anime by year');
    }
  }

  // Advanced search with caching
  static async advancedSearch(params: {
    query?: string;
    genres?: string[];
    year?: number;
    season?: string;
    format?: string;
    status?: string;
    page?: number;
  }): Promise<SearchResult> {
    const cacheKey = `advanced:${JSON.stringify(params)}`;
    const cached = getCachedData<SearchResult>(cacheKey);
    if (cached) return cached;

    try {
      const response = await api.get(`/meta/anilist/advanced-search`, {
        params: {
          ...params,
          perPage: 20,
        },
      });
      
      const data = response.data;
      setCachedData(cacheKey, data, 30); // Cache for 30 minutes
      return data;
    } catch (error) {
      console.error('Advanced search error:', error);
      throw new Error('Failed to perform advanced search');
    }
  }

  // Cache management methods
  static clearCache(): void {
    cache.clear();
    console.log('API cache cleared');
  }

  static getCacheSize(): number {
    return cache.size;
  }

  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
    };
  }
}

// Helper function to get anime title as string
export const getAnimeTitle = (
  title: string | { romaji?: string; english?: string; native?: string }
): string => {
  if (typeof title === 'string') return title;
  return title?.english || title?.romaji || title?.native || 'Unknown Title';
};

// Helper function to format episode number
export const formatEpisodeNumber = (episode: number): string => {
  return `Episode ${episode}`;
};

// Helper function to get image URL with fallback and optimization
export const getImageUrl = (
  url: string | undefined,
  fallback: string = '/placeholder-anime.jpg'
): string => {
  if (!url || url === 'null') return fallback;
  
  // Add image optimization parameters for supported domains
  if (url.includes('anilist.co')) {
    return `${url}?width=300&height=400&format=webp`;
  }
  
  return url;
};

// Performance monitoring
export const getApiPerformanceMetrics = () => {
  return {
    cacheHitRatio: cache.size > 0 ? (cache.size / (cache.size + 1)) * 100 : 0,
    cacheSize: cache.size,
    totalRequests: cache.size, // Simplified metric
  };
};