'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Check, ExternalLink, ArrowRightLeft } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { RatingStars } from './RatingStars';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { AffiliateRedirectModal } from './AffiliateRedirectModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [added, setAdded] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [compared, setCompared] = useState(false);

  const discountPercent = calculateDiscount(product.price, product.discount_price);
  const inWishlist = isInWishlist(product.id);
  const effectivePrice = product.discount_price ?? product.price;

  const isShopSphere = product.source === 'shopsphere';

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isShopSphere) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    } else {
      setShowRedirectModal(true);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = JSON.parse(localStorage.getItem('shopsphere_compare_ids') || '[]');
      let updated: string[];
      if (stored.includes(product.id)) {
        updated = stored.filter((id: string) => id !== product.id);
        setCompared(false);
      } else {
        if (stored.length >= 4) {
          alert('You can compare up to 4 products at a time.');
          return;
        }
        updated = [...stored, product.id];
        setCompared(true);
      }
      localStorage.setItem('shopsphere_compare_ids', JSON.stringify(updated));
    } catch {}
  };

  const mainImage = product.image_urls[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';

  // Source badges
  const renderSourceBadge = () => {
    switch (product.source) {
      case 'amazon':
        return (
          <span className="bg-[#FF9900]/15 text-[#8F5500] border border-[#FF9900]/30 text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900]" /> Amazon Partner
          </span>
        );
      case 'flipkart':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Flipkart Assured
          </span>
        );
      case 'ebay':
        return (
          <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" /> eBay Global
          </span>
        );
      default:
        return (
          <span className="bg-amazon-light_dark text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            ⚡ ShopSphere Direct
          </span>
        );
    }
  };

  return (
    <>
      <div className="group relative bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
        {/* Top bar: Source badge, Discount, Wishlist & Compare */}
        <div className="flex items-center justify-between w-full mb-2 gap-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            {renderSourceBadge()}
            {discountPercent > 0 && (
              <span className="bg-red-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={handleToggleCompare}
              title={compared ? 'Remove from Compare' : 'Add to Compare'}
              className={`p-1.5 rounded-full transition-colors ${
                compared ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'
              }`}
            >
              <ArrowRightLeft size={15} />
            </button>

            <button
              onClick={handleWishlistToggle}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Heart
                size={16}
                className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
              />
            </button>
          </div>
        </div>

        {/* Image container */}
        <Link
          href={`/products/${product.slug}`}
          className="relative w-full h-44 mb-3 overflow-hidden rounded flex items-center justify-center bg-gray-50"
        >
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <div className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold mb-1 flex items-center justify-between">
            <span>{product.brand}</span>
            {product.seller_name && (
              <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                {product.seller_name}
              </span>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-medium text-gray-900 hover:text-amazon-hover line-clamp-2 leading-snug mb-2"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="mb-2">
            <RatingStars rating={product.rating || 4.7} reviewCount={product.review_count || 120} />
          </div>

          {/* Pricing */}
          <div className="mt-auto pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(effectivePrice)}
              </span>
              {product.discount_price && product.discount_price < product.price && (
                <span className="text-xs text-gray-500 line-through">
                  M.R.P.: {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="text-xs font-medium mt-1 flex items-center gap-1 text-gray-600">
              {isShopSphere ? (
                <>
                  <span className="text-amazon-success font-semibold">✓ In Stock</span>
                  <span className="text-gray-400">•</span>
                  <span>FREE Delivery</span>
                </>
              ) : (
                <span className="text-blue-700 font-semibold flex items-center gap-1">
                  Fulfilled on {product.source.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-4">
          <button
            onClick={handleAction}
            className={`w-full py-2 px-3 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              added
                ? 'bg-emerald-600 text-white'
                : isShopSphere
                ? 'bg-amazon-yellow hover:bg-amazon-orange text-gray-900 active:scale-[0.98]'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
            }`}
          >
            {added ? (
              <>
                <Check size={16} /> Added to Cart
              </>
            ) : isShopSphere ? (
              <>
                <ShoppingCart size={15} /> Add to Cart
              </>
            ) : (
              <>
                <ExternalLink size={14} /> Buy on {product.source.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>

      <AffiliateRedirectModal
        product={showRedirectModal ? product : null}
        onClose={() => setShowRedirectModal(false)}
      />
    </>
  );
}
