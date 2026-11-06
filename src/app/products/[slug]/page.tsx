import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts, getProductReviews } from '@/lib/data-service';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { ProductBuyBox } from '@/components/products/ProductBuyBox';
import { RatingStars } from '@/components/products/RatingStars';
import { ProductCard } from '@/components/products/ProductCard';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ShieldCheck, Truck, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id);
  const reviews = await getProductReviews(product.id);
  const discountPercent = calculateDiscount(product.price, product.discount_price);
  const effectivePrice = product.discount_price ?? product.price;

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4 space-y-8">
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>›</span>
        {product.category && (
          <>
            <Link href={`/products?category=${product.category.slug}`} className="hover:underline">
              {product.category.name}
            </Link>
            <span>›</span>
          </>
        )}
        <Link href={`/products?brand=${product.brand}`} className="hover:underline">
          {product.brand}
        </Link>
        <span>›</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main 3-Column Layout: Gallery | Product Info | Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5">
          <ProductImageGallery images={product.image_urls} productName={product.name} />
        </div>

        {/* Middle Column: Details & Specs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <Link
              href={`/products?brand=${product.brand}`}
              className="text-xs font-bold text-amazon-blue hover:text-amazon-hover hover:underline uppercase tracking-wider"
            >
              Brand: {product.brand}
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <RatingStars rating={product.rating || 4.8} reviewCount={product.review_count || 500} />
            <span className="text-gray-400">|</span>
            <span className="text-xs text-gray-600 font-medium">1000+ bought in past month</span>
          </div>

          {/* Pricing Block */}
          <div className="pb-3 border-b border-gray-200 space-y-1">
            <div className="flex items-baseline gap-2.5">
              {discountPercent > 0 && (
                <span className="text-2xl font-light text-red-700">-{discountPercent}%</span>
              )}
              <span className="text-3xl font-extrabold text-gray-900">
                {formatPrice(effectivePrice)}
              </span>
            </div>

            {product.discount_price && product.discount_price < product.price && (
              <div className="text-xs text-gray-500">
                Typical price:{' '}
                <span className="line-through">{formatPrice(product.price)}</span>
              </div>
            )}
            <div className="text-xs text-gray-600 font-medium">Inclusive of all taxes</div>
          </div>

          {/* Promotional Offer Highlights */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 space-y-1.5 text-xs text-gray-800">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Award size={16} className="text-amazon-orange" />
              <span>Special Offers & Promotions</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-[11px]">
              <li>
                <strong>Bank Offer:</strong> Up to ₹1,500 discount on select credit cards.
              </li>
              <li>
                <strong>No Cost EMI:</strong> Available on leading bank debit & credit cards.
              </li>
              <li>
                <strong>Partner Offer:</strong> Get GST invoice and save up to 28% on business purchases.
              </li>
            </ul>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-gray-200 text-xs">
            <div className="flex flex-col items-center">
              <Truck size={20} className="text-amazon-orange mb-1" />
              <span className="text-[11px] font-semibold text-gray-700">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw size={20} className="text-amazon-orange mb-1" />
              <span className="text-[11px] font-semibold text-gray-700">7 Days Return</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck size={20} className="text-amazon-orange mb-1" />
              <span className="text-[11px] font-semibold text-gray-700">Warranty Active</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1.5">About this item</h3>
            <p className="text-xs text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Technical Details</h3>
              <div className="border border-gray-200 rounded overflow-hidden text-xs">
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`grid grid-cols-2 p-2 ${
                      idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <span className="font-semibold text-gray-600">{key}</span>
                    <span className="text-gray-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Buy Box (3 cols) */}
        <div className="lg:col-span-3">
          <ProductBuyBox product={product} />
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Review Summary */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl font-extrabold text-gray-900">
                {product.rating?.toFixed(1) || '4.8'}
              </span>
              <div>
                <RatingStars rating={product.rating || 4.8} showCount={false} size={18} />
                <span className="text-xs text-gray-500">
                  {product.review_count || 500} global ratings
                </span>
              </div>
            </div>

            {/* Rating breakdown bars */}
            <div className="space-y-1.5 text-xs text-gray-600 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-12 text-right">5 star</span>
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-amazon-orange h-full w-[82%]" />
                </div>
                <span className="w-8 text-right font-medium">82%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-right">4 star</span>
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-amazon-orange h-full w-[12%]" />
                </div>
                <span className="w-8 text-right font-medium">12%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-right">3 star</span>
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-amazon-orange h-full w-[4%]" />
                </div>
                <span className="w-8 text-right font-medium">4%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-right">2 star</span>
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-amazon-orange h-full w-[1%]" />
                </div>
                <span className="w-8 text-right font-medium">1%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-right">1 star</span>
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-amazon-orange h-full w-[1%]" />
                </div>
                <span className="w-8 text-right font-medium">1%</span>
              </div>
            </div>
          </div>

          {/* Real Customer Reviews List */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-gray-900">Top reviews from India</h3>
            {reviews.map((rev) => (
              <div key={rev.id} className="border-b border-gray-100 pb-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                    {rev.user_name ? rev.user_name[0] : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    {rev.user_name || 'Verified Customer'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RatingStars rating={rev.rating} showCount={false} size={14} />
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Purchase
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Customers who viewed this item also viewed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

