'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types';
import { Star, RotateCcw } from 'lucide-react';

interface CatalogFilterSidebarProps {
  categories: Category[];
  brands: string[];
  currentCategory?: string;
  currentBrand?: string;
  currentSource?: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentRating?: number;
  currentInStock?: boolean;
}

export function CatalogFilterSidebar({
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentSource,
  currentMinPrice,
  currentMaxPrice,
  currentRating,
  currentInStock,
}: CatalogFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '' || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set('page', '1'); // reset page on filter change
    router.push(`?${params.toString()}`);
  };

  const handlePriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const min = formData.get('min')?.toString();
    const max = formData.get('max')?.toString();

    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');

    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');

    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    router.push(`?${params.toString()}`);
  };

  const hasFilters = Boolean(
    currentCategory ||
      currentBrand ||
      currentMinPrice ||
      currentMaxPrice ||
      currentRating ||
      currentInStock
  );

  return (
    <aside className="w-full lg:w-64 space-y-6 text-sm text-gray-800 pr-2">
      {/* Clear Filters Button */}
      {hasFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded border border-gray-300 transition-colors"
        >
          <RotateCcw size={14} /> Clear all filters
        </button>
      )}

      {/* Category Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">
          Department
        </h3>
        <ul className="space-y-1 text-xs">
          <li>
            <button
              onClick={() => updateParam('category', null)}
              className={`text-left w-full hover:text-amazon-hover py-0.5 ${
                !currentCategory ? 'font-black text-amazon-hover' : 'text-gray-600'
              }`}
            >
              All Departments
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => updateParam('category', cat.slug)}
                className={`text-left w-full hover:text-amazon-hover py-0.5 ${
                  currentCategory === cat.slug
                    ? 'font-black text-amazon-hover'
                    : 'text-gray-600'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-gray-200" />

      {/* Marketplace Source Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">
          Marketplace / Seller
        </h3>
        <ul className="space-y-1 text-xs">
          <li>
            <button
              onClick={() => updateParam('source', null)}
              className={`text-left w-full hover:text-amazon-hover py-0.5 ${
                !currentSource ? 'font-black text-amazon-hover' : 'text-gray-600'
              }`}
            >
              All Marketplaces
            </button>
          </li>
          <li>
            <button
              onClick={() => updateParam('source', 'shopsphere')}
              className={`text-left w-full hover:text-amazon-hover py-0.5 flex items-center justify-between ${
                currentSource === 'shopsphere' ? 'font-black text-amazon-hover' : 'text-gray-600'
              }`}
            >
              <span>⚡ ShopSphere Direct</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => updateParam('source', 'amazon')}
              className={`text-left w-full hover:text-amazon-hover py-0.5 flex items-center justify-between ${
                currentSource === 'amazon' ? 'font-black text-amazon-hover' : 'text-gray-600'
              }`}
            >
              <span>🛒 Amazon Partner</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => updateParam('source', 'flipkart')}
              className={`text-left w-full hover:text-amazon-hover py-0.5 flex items-center justify-between ${
                currentSource === 'flipkart' ? 'font-black text-amazon-hover' : 'text-gray-600'
              }`}
            >
              <span>📦 Flipkart Assured</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => updateParam('source', 'ebay')}
              className={`text-left w-full hover:text-amazon-hover py-0.5 flex items-center justify-between ${
                currentSource === 'ebay' ? 'font-black text-amazon-hover' : 'text-gray-600'
              }`}
            >
              <span>🌐 eBay Global</span>
            </button>
          </li>
        </ul>
      </div>

      <hr className="border-gray-200" />

      {/* Customer Review Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">
          Customer Reviews
        </h3>
        <div className="space-y-1.5 text-xs">
          {[4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() =>
                updateParam('rating', currentRating === stars ? null : stars.toString())
              }
              className={`flex items-center gap-1 text-left w-full py-0.5 ${
                currentRating === stars ? 'font-bold text-amazon-hover' : 'text-gray-600'
              }`}
            >
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="ml-1 text-xs">& Up</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Price Range Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">
          Price (₹)
        </h3>
        <div className="space-y-1 text-xs text-gray-600 mb-3">
          <button
            onClick={() => {
              updateParam('minPrice', null);
              updateParam('maxPrice', '2000');
            }}
            className="block hover:text-amazon-hover text-left w-full"
          >
            Under ₹2,000
          </button>
          <button
            onClick={() => {
              updateParam('minPrice', '2000');
              updateParam('maxPrice', '10000');
            }}
            className="block hover:text-amazon-hover text-left w-full"
          >
            ₹2,000 to ₹10,000
          </button>
          <button
            onClick={() => {
              updateParam('minPrice', '10000');
              updateParam('maxPrice', '30000');
            }}
            className="block hover:text-amazon-hover text-left w-full"
          >
            ₹10,000 to ₹30,000
          </button>
          <button
            onClick={() => {
              updateParam('minPrice', '30000');
              updateParam('maxPrice', null);
            }}
            className="block hover:text-amazon-hover text-left w-full"
          >
            Over ₹30,000
          </button>
        </div>

        {/* Custom Min / Max inputs */}
        <form onSubmit={handlePriceSubmit} className="flex items-center gap-1.5">
          <input
            type="number"
            name="min"
            placeholder="₹ Min"
            defaultValue={currentMinPrice || ''}
            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            name="max"
            placeholder="₹ Max"
            defaultValue={currentMaxPrice || ''}
            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xs font-bold text-gray-800"
          >
            Go
          </button>
        </form>
      </div>

      <hr className="border-gray-200" />

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">
            Brand
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar text-xs">
            {brands.map((b) => (
              <label
                key={b}
                className="flex items-center gap-2 cursor-pointer hover:text-amazon-hover text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={currentBrand === b}
                  onChange={() => updateParam('brand', currentBrand === b ? null : b)}
                  className="rounded text-amazon-orange focus:ring-amazon-orange"
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <hr className="border-gray-200" />

      {/* Availability Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">
          Availability
        </h3>
        <label className="flex items-center gap-2 cursor-pointer hover:text-amazon-hover text-xs text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(currentInStock)}
            onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
            className="rounded text-amazon-orange focus:ring-amazon-orange"
          />
          <span>Include Out of Stock</span>
        </label>
      </div>
    </aside>
  );
}

