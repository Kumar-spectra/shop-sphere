'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Shield, ShoppingCart, Zap, Heart, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { AffiliateRedirectModal } from './AffiliateRedirectModal';

interface ProductBuyBoxProps {
  product: Product;
}

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);

  const effectivePrice = product.discount_price ?? product.price;
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock_quantity <= 0;
  const isShopSphere = product.source === 'shopsphere';

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const providerNames: Record<string, string> = {
    amazon: 'Amazon.in',
    flipkart: 'Flipkart',
    ebay: 'eBay',
  };

  const partnerName = providerNames[product.source] || 'External Partner';

  return (
    <>
      <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm space-y-4">
        {/* Price in Buy Box */}
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(effectivePrice)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Inclusive of all taxes. EMI starts at ₹{(effectivePrice / 12).toFixed(0)}/month.
          </div>
        </div>

        {/* Source info */}
        {!isShopSphere ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1.5">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <ExternalLink size={14} />
              <span>Fulfilled by {partnerName}</span>
            </div>
            <p className="text-[11px] text-blue-800">
              This product is sold and fulfilled directly by an authorized partner on {partnerName}.
            </p>
          </div>
        ) : (
          <div className="text-xs space-y-1.5 text-gray-700">
            <div>
              <span className="text-amazon-blue font-bold">FREE Delivery</span>{' '}
              <span className="font-semibold text-gray-900">Tomorrow by 9 PM</span>.
            </div>
            <div className="text-gray-500">
              Order within <span className="text-emerald-700 font-bold">4 hrs 20 mins</span>.
            </div>
            <div className="flex items-center gap-1 text-gray-600 pt-1">
              <MapPin size={14} className="text-gray-500" />
              <span>Deliver to Mumbai 400001</span>
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div>
          {isOutOfStock ? (
            <span className="text-red-700 font-bold text-sm block">Currently unavailable.</span>
          ) : product.stock_quantity <= 5 ? (
            <span className="text-red-700 font-bold text-sm block">
              Only {product.stock_quantity} left in stock - order soon.
            </span>
          ) : (
            <span className="text-amazon-success font-bold text-sm block">In stock</span>
          )}
        </div>

        {/* Internal Actions vs Affiliate Action */}
        {isShopSphere ? (
          <>
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <label htmlFor="qty-select" className="text-xs font-bold text-gray-700">
                  Quantity:
                </label>
                <select
                  id="qty-select"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amazon-orange cursor-pointer"
                >
                  {Array.from({ length: Math.min(10, product.stock_quantity) }).map((_, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {idx + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-2.5 px-4 rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amazon-yellow hover:bg-amazon-orange text-gray-950 active:scale-[0.98]'
                } ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-200' : ''}`}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`w-full py-2.5 px-4 rounded-full text-xs font-bold bg-[#FFA41C] hover:bg-[#FA8900] text-gray-950 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] ${
                  isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-200' : ''
                }`}
              >
                <Zap size={16} /> Buy Now
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowRedirectModal(true)}
              className="w-full py-3 px-4 rounded-full text-xs font-bold bg-amazon-yellow hover:bg-amazon-orange text-gray-950 shadow transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <ExternalLink size={15} /> Buy on {partnerName}
            </button>
            <p className="text-[11px] text-gray-500 text-center leading-tight">
              Redirects to official partner site for checkout.
            </p>
          </div>
        )}

        {/* Fulfilled / Ships from */}
        <div className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-200">
          <div className="flex justify-between">
            <span>Ships from</span>
            <span className="font-medium text-gray-800">
              {isShopSphere ? 'ShopSphere Warehouse' : partnerName}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Sold by</span>
            <span className="font-medium text-gray-800">
              {product.seller_name || (isShopSphere ? `${product.brand} Retail` : partnerName)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Payment</span>
            <span className="font-medium text-gray-800">
              {isShopSphere ? 'Cashfree / COD / Stripe' : `${partnerName} Direct`}
            </span>
          </div>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="w-full text-left flex items-center gap-2 text-xs font-medium text-amazon-blue hover:text-amazon-hover hover:underline pt-2 border-t border-gray-100"
        >
          <Heart
            size={16}
            className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
          <span>{inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
        </button>

        {/* Security note */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 justify-center pt-1">
          <Shield size={14} className="text-emerald-600" />
          <span>100% Secure transaction guarantee</span>
        </div>
      </div>

      <AffiliateRedirectModal
        product={showRedirectModal ? product : null}
        onClose={() => setShowRedirectModal(false)}
      />
    </>
  );
}
