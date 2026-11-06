import React from 'react';
import { getCategories, getProducts, getCategoryBySlug } from '@/lib/data-service';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CatalogFilterSidebar } from '@/components/products/CatalogFilterSidebar';
import { CatalogSortBar } from '@/components/products/CatalogSortBar';
import { Pagination } from '@/components/products/Pagination';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    source?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    inStock?: string;
    sort?: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
    page?: string;
    deals?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const categories = await getCategories();

  const category = resolvedParams.category;
  const brand = resolvedParams.brand;
  const source = resolvedParams.source;
  const minPrice = resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined;
  const rating = resolvedParams.rating ? Number(resolvedParams.rating) : undefined;
  const inStock = resolvedParams.inStock === 'true';
  const sort = resolvedParams.sort || 'featured';
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

  const currentCategoryObj = category ? await getCategoryBySlug(category) : null;

  const { products, total, brands, totalPages } = await getProducts({
    category,
    brand,
    source,
    minPrice,
    maxPrice,
    rating,
    inStock,
    sort,
    page,
    limit: 12,
  });

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      {/* Breadcrumb Header */}
      <div className="mb-4 text-xs text-gray-500">
        <span>Products</span>
        {currentCategoryObj && (
          <>
            <span className="mx-1.5">›</span>
            <span className="font-bold text-gray-800">{currentCategoryObj.name}</span>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Filter Sidebar */}
        <CatalogFilterSidebar
          categories={categories}
          brands={brands}
          currentCategory={category}
          currentBrand={brand}
          currentSource={source}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentRating={rating}
          currentInStock={inStock}
        />

        {/* Right Main Content */}
        <div className="flex-1">
          <CatalogSortBar
            total={total}
            currentSort={sort}
            categoryName={currentCategoryObj?.name}
          />

          <ProductGrid products={products} />

          <Pagination page={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}

