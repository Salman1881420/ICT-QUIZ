import { NextRequest, NextResponse } from 'next/server';
import { AnimeAPI } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Anime ID is required' },
        { status: 400 }
      );
    }

    const result = await AnimeAPI.getAnimeInfo(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Anime info API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch anime information' },
      { status: 500 }
    );
  }
}