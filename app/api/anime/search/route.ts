import { NextRequest, NextResponse } from 'next/server';
import { AnimeAPI } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const genre = searchParams.get('genre');
    const year = searchParams.get('year');

    if (!query && !genre && !year) {
      return NextResponse.json(
        { error: 'Query, genre, or year parameter is required' },
        { status: 400 }
      );
    }

    let result;

    if (genre) {
      result = await AnimeAPI.getAnimeByGenre(genre, page);
    } else if (year) {
      result = await AnimeAPI.getAnimeByYear(parseInt(year), page);
    } else if (query) {
      result = await AnimeAPI.search(query, page);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search anime' },
      { status: 500 }
    );
  }
}