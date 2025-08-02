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

const BASE_URL = 'https://api.consumet.org';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class AnimeAPI {
  // Search anime by query
  static async search(
    query: string,
    page: number = 1
  ): Promise<SearchResult> {
    try {
      const response = await api.get(`/meta/anilist/advanced-search`, {
        params: {
          query,
          page,
          perPage: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search anime');
    }
  }

  // Get trending anime
  static async getTrending(page: number = 1): Promise<TrendingResult> {
    try {
      const response = await api.get(`/meta/anilist/trending`, {
        params: { page, perPage: 20 },
      });
      return response.data;
    } catch (error) {
      console.error('Trending error:', error);
      throw new Error('Failed to fetch trending anime');
    }
  }

  // Get popular anime
  static async getPopular(page: number = 1): Promise<PopularResult> {
    try {
      const response = await api.get(`/meta/anilist/popular`, {
        params: { page, perPage: 20 },
      });
      return response.data;
    } catch (error) {
      console.error('Popular error:', error);
      throw new Error('Failed to fetch popular anime');
    }
  }

  // Get recent episodes
  static async getRecentEpisodes(
    page: number = 1
  ): Promise<RecentEpisodesResult> {
    try {
      const response = await api.get(`/anime/gogoanime/recent-episodes`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Recent episodes error:', error);
      throw new Error('Failed to fetch recent episodes');
    }
  }

  // Get anime info by ID
  static async getAnimeInfo(id: string): Promise<AnimeInfo> {
    try {
      const response = await api.get(`/meta/anilist/info/${id}`);
      return response.data;
    } catch (error) {
      console.error('Anime info error:', error);
      throw new Error('Failed to fetch anime info');
    }
  }

  // Get episode streaming links
  static async getEpisodeStreaming(episodeId: string): Promise<IVideoResult> {
    try {
      const response = await api.get(`/anime/gogoanime/watch/${episodeId}`);
      return response.data;
    } catch (error) {
      console.error('Episode streaming error:', error);
      throw new Error('Failed to fetch episode streaming links');
    }
  }

  // Get anime by genre
  static async getAnimeByGenre(
    genre: string,
    page: number = 1
  ): Promise<SearchResult> {
    try {
      const response = await api.get(`/meta/anilist/advanced-search`, {
        params: {
          genres: [genre],
          page,
          perPage: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Genre search error:', error);
      throw new Error('Failed to fetch anime by genre');
    }
  }

  // Get anime by year
  static async getAnimeByYear(
    year: number,
    page: number = 1
  ): Promise<SearchResult> {
    try {
      const response = await api.get(`/meta/anilist/advanced-search`, {
        params: {
          year,
          page,
          perPage: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Year search error:', error);
      throw new Error('Failed to fetch anime by year');
    }
  }

  // Advanced search with multiple filters
  static async advancedSearch(params: {
    query?: string;
    genres?: string[];
    year?: number;
    season?: string;
    format?: string;
    status?: string;
    page?: number;
  }): Promise<SearchResult> {
    try {
      const response = await api.get(`/meta/anilist/advanced-search`, {
        params: {
          ...params,
          perPage: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Advanced search error:', error);
      throw new Error('Failed to perform advanced search');
    }
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

// Helper function to get image URL with fallback
export const getImageUrl = (
  url: string | undefined,
  fallback: string = '/placeholder-anime.jpg'
): string => {
  return url && url !== 'null' ? url : fallback;
};