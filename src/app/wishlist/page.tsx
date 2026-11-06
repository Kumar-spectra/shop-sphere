'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { RatingStars } from '@/components/products/RatingStars';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is empty</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Explore our curated departments and tap the heart icon on any product to save it for later.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-full text-sm shadow transition-transform hover:scale-105"
          >
            Start Shopping Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Saved Wishlist</h1>
          <p className="text-xs text-gray-500 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved for future purchase
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-amazon-blue hover:text-amazon-hover hover:underline"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => {
          const effectivePrice = item.product.discount_price ?? item.product.price;
          const mainImg =
            item.product.image_urls[0] ||
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';

          return (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative block w-full h-48 bg-gray-50 rounded overflow-hidden mb-3"
                >
                  <Image
                    src={mainImg}
                    alt={item.product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-contain p-2 hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                  {item.product.brand}
                </div>

                <Link
                  href={`/products/${item.product.slug}`}
                  className="text-sm font-semibold text-gray-900 hover:text-amazon-hover line-clamp-2 leading-snug mb-2"
                >
                  {item.product.name}
                </Link>

                <div className="mb-2">
                  <RatingStars rating={item.product.rating || 4.7} reviewCount={item.product.review_count || 120} />
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(effectivePrice)}
                  </span>
                  {item.product.discount_price && item.product.discount_price < item.product.price && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(item.product.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    addToCart(item.product, 1);
                    removeFromWishlist(item.product_id);
                  }}
                  className="w-full py-2 px-3 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 text-xs font-bold rounded-full shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingCart size={14} /> Move to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(item.product_id)}
                  className="w-full py-1.5 text-xs text-gray-500 hover:text-red-600 font-medium flex items-center justify-center gap-1"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

