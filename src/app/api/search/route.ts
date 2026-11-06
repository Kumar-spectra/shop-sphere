import { NextRequest, NextResponse } from 'next/server';
import { SearchOrchestrator } from '@/lib/search/search-orchestrator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const sort = searchParams.get('sort') || 'featured';
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24;

    const orchestrator = SearchOrchestrator.getInstance();
    const result = await orchestrator.executeSearch({
      query,
      category,
      sort,
      minPrice,
      maxPrice,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in /api/search:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal search engine error',
      },
      { status: 500 }
    );
  }
}

