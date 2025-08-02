export interface AnimeInfo {
  id: string;
  title: string | { romaji?: string; english?: string; native?: string };
  malId?: number;
  synonyms?: string[];
  isLicensed?: boolean;
  isAdult?: boolean;
  countryOfOrigin?: string;
  trailer?: {
    id: string;
    site?: string;
    thumbnail?: string;
  };
  image: string;
  popularity?: number;
  color?: string;
  cover?: string;
  description?: string;
  status?: string;
  releaseDate?: number;
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  endDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  totalEpisodes?: number;
  currentEpisode?: number;
  rating?: number;
  duration?: number;
  genres?: string[];
  season?: string;
  studios?: string[];
  subOrDub?: 'sub' | 'dub' | 'both';
  type?: string;
  recommendations?: IAnimeResult[];
  characters?: any[];
  relations?: any[];
  episodes?: IAnimeEpisode[];
}

export interface IAnimeResult {
  id: string;
  title: string | { romaji?: string; english?: string; native?: string };
  image: string;
  cover?: string;
  popularity?: number;
  description?: string;
  rating?: number;
  genres?: string[];
  color?: string;
  totalEpisodes?: number;
  currentEpisodeCount?: number;
  type?: string;
  releaseDate?: string | number;
}

export interface IAnimeEpisode {
  id: string;
  title?: string;
  description?: string;
  number: number;
  image?: string;
  imageHash?: string;
  airDate?: string;
}

export interface IVideoSource {
  url: string;
  quality?: string;
  isM3U8?: boolean;
}

export interface IVideoResult {
  headers?: Record<string, string>;
  sources: IVideoSource[];
  download?: string;
  embedURL?: string;
}

export interface SearchResult {
  currentPage?: number;
  hasNextPage?: boolean;
  totalPages?: number;
  totalResults?: number;
  results: IAnimeResult[];
}

export interface GenreResult {
  id: string;
  title: string;
}

export interface TrendingResult {
  currentPage?: number;
  hasNextPage?: boolean;
  results: IAnimeResult[];
}

export interface PopularResult {
  currentPage?: number;
  hasNextPage?: boolean;
  results: IAnimeResult[];
}

export interface RecentEpisodesResult {
  currentPage?: number;
  hasNextPage?: boolean;
  results: IAnimeResult[];
}