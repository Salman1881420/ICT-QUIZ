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
        { error: 'Episode ID is required' },
        { status: 400 }
      );
    }

    const result = await AnimeAPI.getEpisodeStreaming(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Episode streaming API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episode streaming links' },
      { status: 500 }
    );
  }
}