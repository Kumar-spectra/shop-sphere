'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CatalogSortBarProps {
  total: number;
  currentSort?: string;
  query?: string;
  categoryName?: string;
}

export function CatalogSortBar({
  total,
  currentSort = 'featured',
  query,
  categoryName,
}: CatalogSortBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
      <div className="text-xs text-gray-700">
        <span className="font-bold text-gray-900">{total} results</span>
        {query && (
          <span>
            {' '}
            for <span className="text-amazon-hover font-bold">"{query}"</span>
          </span>
        )}
        {categoryName && (
          <span>
            {' '}
            in <span className="font-semibold text-gray-900">{categoryName}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <label htmlFor="sort-select" className="text-gray-600 font-medium shrink-0">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={handleSortChange}
          className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 font-medium focus:ring-1 focus:ring-amazon-orange focus:outline-none cursor-pointer"
        >
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Avg. Customer Review</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>
    </div>
  );
}

