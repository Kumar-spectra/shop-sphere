import { NextRequest, NextResponse } from 'next/server';
import { preprocessQuery } from '@/lib/search/search-engine';
import { INITIAL_PRODUCTS } from '@/data/mock-data';

const COMMON_SEARCH_SUGGESTIONS = [
  'tea strainer',
  'stone for tea',
  'tea infuser basket',
  'iphone 17 pro',
  'macbook air m3',
  'laptop charger usb-c',
  'running shoes',
  'ergonomic office chair',
  'insulated water bottle',
  'wireless noise cancelling headphones',
  'kitchen cookware utensils',
  'casio g-shock watch',
  'fire tv stick 4k',
  'kindle paperwhite 16gb',
  'mechanical gaming keyboard',
  'fast charging power bank',
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const processed = preprocessQuery(q);
  const queryLower = processed.normalized;

  const results = new Set<string>();

  // Add typo correction candidate if available
  if (processed.corrected && processed.corrected !== queryLower) {
    results.add(processed.corrected);
  }

  // Add synonym suggestions
  processed.synonyms.forEach((syn) => results.add(syn));

  // Match common queries
  COMMON_SEARCH_SUGGESTIONS.forEach((term) => {
    if (term.toLowerCase().includes(queryLower)) {
      results.add(term);
    }
  });

  // Match catalog product names
  INITIAL_PRODUCTS.forEach((product) => {
    if (product.name.toLowerCase().includes(queryLower)) {
      results.add(product.name.slice(0, 45));
    }
  });

  const suggestions = Array.from(results).slice(0, 8);

  return NextResponse.json({
    query: q,
    suggestions,
    corrected: processed.corrected,
  });
}

