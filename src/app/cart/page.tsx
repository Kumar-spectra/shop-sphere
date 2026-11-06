'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    deliveryCharges,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { addToWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amazon-orange">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your ShopSphere Cart is empty</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Your shopping cart is waiting. Give it purpose — fill it with electronics, smartphones, fashion, and deals today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/products"
              className="px-6 py-2.5 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-full text-sm shadow-sm transition-transform hover:scale-105"
            >
              Explore All Products
            </Link>
            <Link
              href="/products?deals=true"
              className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold rounded-full text-sm"
            >
              Shop Today's Deals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cart Items (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-xs text-amazon-success font-semibold mt-0.5">
                {deliveryCharges === 0
                  ? '✓ Your order qualifies for FREE Delivery!'
                  : `Add ₹${500 - (subtotal - discount)} more for FREE Delivery`}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-xs text-amazon-blue hover:text-amazon-hover hover:underline font-medium"
            >
              Deselect & Clear Cart
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map((item) => {
              const effectivePrice = item.product.discount_price ?? item.product.price;
              const discountPercent = calculateDiscount(item.product.price, item.product.discount_price);
              const mainImg =
                item.product.image_urls[0] ||
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';

              return (
                <div key={item.id} className="py-5 flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="relative w-28 h-28 sm:w-36 sm:h-36 bg-gray-50 rounded border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center"
                  >
                    <Image
                      src={mainImg}
                      alt={item.product.name}
                      fill
                      sizes="144px"
                      className="object-contain p-2 hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-base font-semibold text-gray-900 hover:text-amazon-hover line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-right shrink-0">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(effectivePrice * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-xs text-gray-500 block">
                              ({formatPrice(effectivePrice)} each)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">Brand: {item.product.brand}</div>
                      <div className="text-xs text-amazon-success font-medium mt-0.5">In Stock</div>
                      <div className="text-xs text-gray-500">Eligible for FREE Shipping</div>
                    </div>

                    {/* Quantity controls and actions */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-2 border-t border-gray-100 text-xs">
                      <div className="flex items-center border border-gray-300 rounded bg-gray-50 shadow-inner">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-200 text-gray-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= (item.product.stock_quantity || 99)}
                          className="p-1.5 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-amazon-blue hover:text-red-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Trash2 size={13} /> Delete
                      </button>

                      <button
                        onClick={() => {
                          addToWishlist(item.product);
                          removeFromCart(item.product_id);
                        }}
                        className="text-amazon-blue hover:text-amazon-hover hover:underline font-medium"
                      >
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-right pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-700">
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):{' '}
              <strong className="text-lg text-gray-900">
                {formatPrice(subtotal - discount)}
              </strong>
            </span>
          </div>
        </div>

        {/* Right Column: Checkout Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-200 pb-3">
            <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 mb-1">
              <ShieldCheck size={16} /> 100% Purchase Protection
            </div>
            <div className="text-xs text-gray-600">
              Part of your order qualifies for FREE Delivery. Choose this option at checkout.
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Total ({itemCount}):</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Savings Discount:</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee:</span>
              <span>
                {deliveryCharges === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase">FREE</span>
                ) : (
                  formatPrice(deliveryCharges)
                )}
              </span>
            </div>

            <hr className="border-gray-200 my-2" />

            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Order Total:</span>
              <span className="text-xl text-amazon-hover">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Proceed to Checkout CTA */}
          <Link
            href="/checkout"
            className="w-full py-3 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-full text-sm text-center shadow transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            Proceed to Buy ({itemCount} items) <ArrowRight size={16} />
          </Link>

          <div className="text-[11px] text-gray-500 text-center">
            By placing your order, you agree to ShopSphere's privacy notice and conditions of use.
          </div>
        </div>
      </div>
    </div>
  );
}

