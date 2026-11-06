import React from 'react';
import Link from 'next/link';
import { getCategories, getCategoryBySlug } from '@/lib/data-service';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CatalogFilterSidebar } from '@/components/products/CatalogFilterSidebar';
import { CatalogSortBar } from '@/components/products/CatalogSortBar';
import { Pagination } from '@/components/products/Pagination';
import { SearchOrchestrator } from '@/lib/search/search-orchestrator';
import { SearchProviderStatusPanel } from '@/components/search/SearchProviderStatusPanel';
import { Search, Sparkles } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    source?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    inStock?: string;
    sort?: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'discount' | 'newest';
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const categories = await getCategories();

  const query = (resolvedParams.q || '').trim();
  const category = resolvedParams.category;
  const brand = resolvedParams.brand;
  const source = resolvedParams.source;
  const minPrice = resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined;
  const rating = resolvedParams.rating ? Number(resolvedParams.rating) : undefined;
  const inStock = resolvedParams.inStock === 'true';
  const sort = resolvedParams.sort || 'featured';
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
  const pageSize = 12;

  const currentCategoryObj = category ? await getCategoryBySlug(category) : null;

  // Execute universal search across all marketplace providers
  const orchestrator = SearchOrchestrator.getInstance();
  const searchResult = await orchestrator.executeSearch({
    query,
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
  });

  let filteredProducts = searchResult.products;

  // Filter by source if specified (amazon, flipkart, ebay, shopsphere)
  if (source && source !== 'all') {
    filteredProducts = filteredProducts.filter((p) => p.source === source);
  }

  // Filter by brand if specified
  if (brand) {
    filteredProducts = filteredProducts.filter(
      (p) => p.brand.toLowerCase() === brand.toLowerCase()
    );
  }

  // Filter by rating if specified
  if (rating !== undefined) {
    filteredProducts = filteredProducts.filter((p) => (p.rating ?? 0) >= rating);
  }

  // Filter by stock if specified
  if (inStock) {
    filteredProducts = filteredProducts.filter((p) => p.stock_quantity > 0);
  }

  // Pagination
  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Suggested phrases
  const corrected = searchResult.processed?.corrected;
  const suggestedPhrases = searchResult.processed?.suggestedPhrases || [];

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      {/* Breadcrumb & Query Header */}
      <div className="mb-3 text-xs text-gray-500 flex items-center justify-between">
        <div>
          <span>Search</span>
          {query && (
            <>
              <span className="mx-1.5">›</span>
              <span className="font-bold text-gray-800">"{query}"</span>
            </>
          )}
        </div>
      </div>

      {/* "Did you mean...?" and Synonyms Banner */}
      {query && (corrected || suggestedPhrases.length > 0) && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs flex flex-wrap items-center gap-2">
          {corrected && corrected.toLowerCase() !== query.toLowerCase() && (
            <div className="flex items-center gap-1.5 font-medium text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Did you mean:</span>
              <Link
                href={`/search?q=${encodeURIComponent(corrected)}`}
                className="text-blue-700 font-bold hover:underline italic"
              >
                "{corrected}"
              </Link>
              <span className="text-gray-300">|</span>
            </div>
          )}

          {suggestedPhrases.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-gray-600">
              <span>Related:</span>
              {suggestedPhrases.map((phrase) => (
                <Link
                  key={phrase}
                  href={`/search?q=${encodeURIComponent(phrase)}`}
                  className="bg-white hover:bg-amber-100 border border-amber-200 rounded px-2 py-0.5 text-blue-700 hover:text-blue-900 transition-colors"
                >
                  {phrase}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Diagnostic Provider Status Bar */}
      {query && (
        <SearchProviderStatusPanel
          query={query}
          providers={searchResult.providers}
          executionTimeMs={searchResult.executionTimeMs}
          totalProducts={searchResult.total}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <CatalogFilterSidebar
          categories={categories}
          brands={searchResult.brands}
          currentCategory={category}
          currentBrand={brand}
          currentSource={source}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentRating={rating}
          currentInStock={inStock}
        />

        <div className="flex-1">
          <CatalogSortBar
            total={total}
            currentSort={sort as any}
            query={query}
            categoryName={currentCategoryObj?.name}
          />

          <ProductGrid
            products={paginatedProducts}
            emptyMessage={
              query
                ? `No matching products are currently listed in the ShopSphere catalogue or connected APIs. Use the Amazon, Flipkart and eBay search links above to see their current listings.`
                : 'Browse products across ShopSphere, Amazon, Flipkart, and eBay.'
            }
          />

          <Pagination page={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
