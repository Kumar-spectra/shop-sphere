'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Banknote,
  Lock,
  Tag,
  Check,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Address, PaymentMethod } from '@/types';
import { validateCoupon } from '@/lib/coupons/coupon-service';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, discount, deliveryCharges, total: baseTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState<Address>({
    full_name: user?.full_name || 'Rahul Kumar',
    phone: user?.phone || '+91 98765 43210',
    address_line_1: 'Flat 402, Sea Green Apartments, Bandra West',
    address_line_2: 'Near Hill Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400050',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cashfree');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No items to checkout</h1>
        <p className="text-sm text-gray-500 mb-6">
          Your shopping cart is empty. Please add items before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="px-6 py-2.5 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-full text-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    const currentTotal = subtotal - discount;
    const res = validateCoupon(couponCodeInput, currentTotal);

    if (res.valid) {
      setAppliedCoupon({ code: res.coupon!.code, discount: res.discountAmount });
      setCouponMessage({ text: res.message, success: true });
    } else {
      setCouponMessage({ text: res.message, success: false });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponMessage(null);
  };

  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalOrderTotal = Math.max(0, baseTotal - couponDiscount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          address,
          paymentMethod,
          couponCode: appliedCoupon?.code,
          discountAmount: couponDiscount,
          origin: window.location.origin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      const newOrderId = data.orderId || `ORD-${Date.now()}`;
      const savedOrders = JSON.parse(localStorage.getItem('shopsphere_user_orders') || '[]');
      const orderRecord = {
        id: newOrderId,
        user_id: user?.id || 'demo-user-123',
        total_amount: finalOrderTotal,
        subtotal_amount: subtotal - discount,
        discount_amount: couponDiscount,
        coupon_code: appliedCoupon?.code || null,
        shipping_address: address,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : paymentMethod === 'cashfree' ? 'pending' : 'paid',
        order_status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
        shipment: data.shipment,
        cashfree_order_id: data.cfOrderId || null,
        created_at: new Date().toISOString(),
        order_items: items.map((i) => ({
          product_id: i.product_id,
          product_name: i.product.name,
          product_image: i.product.image_urls[0],
          unit_price: i.product.discount_price ?? i.product.price,
          quantity: i.quantity,
          subtotal: (i.product.discount_price ?? i.product.price) * i.quantity,
        })),
      };

      savedOrders.unshift(orderRecord);
      localStorage.setItem('shopsphere_user_orders', JSON.stringify(savedOrders));

      clearCart();

      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push(`/checkout/success?order_id=${newOrderId}&method=${paymentMethod}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while placing your order.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <Link href="/" className="text-2xl font-black text-amazon-dark">
          Shop<span className="text-amazon-orange">Sphere</span>
          <span className="text-xs font-bold text-gray-500 ml-2">Checkout</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          <Lock size={16} className="text-emerald-600" />
          <span>SSL 256-bit Encrypted Checkout</span>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Steps 1, 2, 3, 4 (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-amazon-orange text-gray-950 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={address.full_name}
                  onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">
                  Street Address (Flat, House no., Building, Apartment) *
                </label>
                <input
                  type="text"
                  required
                  value={address.address_line_1}
                  onChange={(e) => setAddress({ ...address, address_line_1: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">
                  Area, Colony, Street, Sector (Optional)
                </label>
                <input
                  type="text"
                  value={address.address_line_2 || ''}
                  onChange={(e) => setAddress({ ...address, address_line_2: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">PIN Code (India) *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={address.postal_code}
                  onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shiprocket Delivery Option */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amazon-orange text-gray-950 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-lg font-bold text-gray-900">Shiprocket Logistics Speed</h2>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                SHIPROCKET VERIFIED
              </span>
            </div>

            <div className="border border-amazon-orange bg-amber-50/40 rounded-lg p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Truck className="text-amazon-orange shrink-0" size={24} />
                <div>
                  <div className="font-bold text-gray-900">
                    Delhivery Surface Express (Shiprocket Partner)
                  </div>
                  <div className="text-gray-500">
                    Serviceable for PIN {address.postal_code} • Estimated delivery Tomorrow by 9 PM
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700 uppercase">
                  {deliveryCharges === 0 ? 'FREE' : formatPrice(deliveryCharges)}
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amazon-orange text-gray-950 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h2 className="text-lg font-bold text-gray-900">Select Payment Method</h2>
              </div>
              <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                ₹0 LEARNING MODE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Option A: Cashfree Payment Gateway */}
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'cashfree'
                    ? 'border-amazon-orange bg-amber-50/30 ring-1 ring-amazon-orange'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cashfree'}
                  onChange={() => setPaymentMethod('cashfree')}
                  className="mt-1 text-amazon-orange focus:ring-amazon-orange"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <Zap className="text-purple-600" size={18} />
                    <span>Cashfree Payment Gateway (India) - Recommended</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                      Simulator Ready
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1">
                    Simulate full Indian payment flow: UPI, Netbanking, Cards. Interactive simulator tests Success, Failure, and Pending drops with signed webhooks. Zero real money collected.
                  </p>
                </div>
              </label>

              {/* Option B: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-amazon-orange bg-amber-50/30 ring-1 ring-amazon-orange'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-amazon-orange focus:ring-amazon-orange"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <Banknote className="text-emerald-700" size={18} />
                    <span>Cash on Delivery (Pay upon arrival) - Demo Option</span>
                  </div>
                  <p className="text-gray-500 mt-1">
                    Pay with Cash, UPI, or Card upon delivery at your doorstep with verified OTP receipt.
                  </p>
                </div>
              </label>

              {/* Option C: Stripe Test Mode */}
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-amazon-orange bg-amber-50/30 ring-1 ring-amazon-orange'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className="mt-1 text-amazon-orange focus:ring-amazon-orange"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <CreditCard className="text-amazon-blue" size={18} />
                    <span>Stripe Checkout (Test Mode)</span>
                  </div>
                  <p className="text-gray-500 mt-1">
                    Pay using test credentials via Stripe hosted session.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Step 4: Items Review */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-amazon-orange text-gray-950 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h2 className="text-lg font-bold text-gray-900">Review Items ({itemCount})</h2>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs py-2 border-b border-gray-100 last:border-0">
                  <div className="relative w-12 h-12 bg-gray-50 rounded shrink-0">
                    <Image
                      src={item.product.image_urls[0]}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 line-clamp-1">
                      {item.product.name}
                    </div>
                    <div className="text-gray-500">Qty: {item.quantity} • Fulfilled by ShopSphere Direct</div>
                  </div>
                  <div className="font-bold text-gray-900">
                    {formatPrice((item.product.discount_price ?? item.product.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Box & Coupons (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          {/* Coupon Code Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-xs space-y-2">
            <div className="font-bold text-gray-800 flex items-center gap-1.5">
              <Tag size={15} className="text-amazon-orange" />
              <span>Apply Promo Code</span>
            </div>

            {!appliedCoupon ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Try: LEARN10 or SPHERE500"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded uppercase font-mono text-xs focus:border-amazon-orange focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 font-bold rounded text-xs text-gray-800"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setCouponCodeInput('LEARN10')}
                    className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-mono hover:bg-amber-100"
                  >
                    LEARN10 (10% off)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCouponCodeInput('SPHERE500')}
                    className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-mono hover:bg-amber-100"
                  >
                    SPHERE500 (₹500 off)
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-800 font-mono block">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Saved -{formatPrice(appliedCoupon.discount)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-[11px] text-red-600 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            )}

            {couponMessage && (
              <p className={`text-[11px] font-medium ${couponMessage.success ? 'text-emerald-700' : 'text-red-600'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Summary Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-full text-sm shadow transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting
                ? 'Processing Order...'
                : paymentMethod === 'cashfree'
                ? `Pay with Cashfree ${formatPrice(finalOrderTotal)}`
                : `Place Order in ₹`}
            </button>

            <p className="text-[11px] text-gray-500 text-center leading-tight">
              By placing your order, you agree to ShopSphere's conditions of use and privacy notice.
            </p>

            <hr className="border-gray-200" />

            <h3 className="font-bold text-sm text-gray-900">Order Summary</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Product Savings:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Code ({appliedCoupon.code}):</span>
                  <span>-{formatPrice(appliedCoupon.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shiprocket Delivery Fee:</span>
                <span>
                  {deliveryCharges === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatPrice(deliveryCharges)
                  )}
                </span>
              </div>

              <hr className="border-gray-200 my-2" />

              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Final Order Total:</span>
                <span className="text-xl text-amazon-hover">{formatPrice(finalOrderTotal)}</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-[11px] text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>ShopSphere ₹0 Guarantee</span>
              </div>
              <div>Simulated environment active. Zero payment gateway charges.</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
