import { NextRequest, NextResponse } from 'next/server';
import { AnimeAPI } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');

    const result = await AnimeAPI.getRecentEpisodes(page);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Recent episodes API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent episodes' },
      { status: 500 }
    );
  }
}