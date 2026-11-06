'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, ArrowRight, Home } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || `ORD-${Date.now()}`;
  const method = searchParams.get('method') || 'cod';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
            ORDER CONFIRMED
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Thank you, your order has been placed!
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            An order confirmation with delivery tracking details has been generated.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Order Number:</span>
            <span className="font-bold text-gray-900">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Mode:</span>
            <span className="font-semibold text-gray-800 uppercase">
              {method === 'cod' ? 'Cash on Delivery (Pay upon arrival)' : 'Card Payment (Stripe)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Delivery:</span>
            <span className="font-bold text-emerald-700">Tomorrow by 9:00 PM</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Link
            href={`/orders/${orderId}`}
            className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-full text-xs shadow transition-colors"
          >
            <PackageCheck size={16} /> Track & View Order Details
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold rounded-full text-xs transition-colors"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading order confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

