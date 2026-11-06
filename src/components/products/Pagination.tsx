'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-1.5 my-8">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
      >
        <ChevronLeft size={16} /> Previous
      </button>

      {Array.from({ length: totalPages }).map((_, idx) => {
        const p = idx + 1;
        const isActive = p === page;
        return (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
              isActive
                ? 'bg-amazon-orange text-gray-950 shadow-sm'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}

