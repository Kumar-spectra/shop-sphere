'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  CheckCircle,
  Truck,
  Clock,
  MapPin,
  CreditCard,
  Ban,
  ArrowLeft,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

const TRACKING_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'pending', label: 'Ordered', desc: 'Order received & queued' },
  { status: 'confirmed', label: 'Confirmed', desc: 'Seller verified & assigned' },
  { status: 'processing', label: 'Processing', desc: 'Packed at fulfillment center' },
  { status: 'shipped', label: 'Shipped', desc: 'In transit with courier' },
  { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'With local courier agent' },
  { status: 'delivered', label: 'Delivered', desc: 'Delivered to recipient' },
];

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shopsphere_user_orders');
      if (stored) {
        const parsed: Order[] = JSON.parse(stored);
        const match = parsed.find((o) => o.id === orderId);
        if (match) {
          setOrder(match);
          setLoading(false);
          return;
        }
      }

      // Fallback demo order
      setOrder({
        id: orderId,
        user_id: 'demo-user-123',
        total_amount: 24990,
        shipping_address: {
          full_name: 'Rahul Kumar',
          phone: '+91 98765 43210',
          address_line_1: 'Flat 402, Sea Green Apartments, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postal_code: '400050',
          country: 'India',
        },
        payment_method: 'cod',
        payment_status: 'paid',
        order_status: 'shipped',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        order_items: [
          {
            product_id: 'p1000000-0000-0000-0000-000000000001',
            product_name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
            product_image:
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            unit_price: 24990,
            quantity: 1,
            subtotal: 24990,
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [orderId]);

  const handleCancelOrder = () => {
    if (!order) return;
    if (confirm('Are you sure you want to cancel this order?')) {
      const updated: Order = { ...order, order_status: 'cancelled' };
      setOrder(updated);

      try {
        const stored = localStorage.getItem('shopsphere_user_orders');
        if (stored) {
          const parsed: Order[] = JSON.parse(stored);
          const next = parsed.map((o) => (o.id === order.id ? updated : o));
          localStorage.setItem('shopsphere_user_orders', JSON.stringify(next));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-500">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-gray-800">Order not found</h2>
        <Link href="/orders" className="text-amazon-blue hover:underline text-xs mt-2 inline-block">
          Return to orders list
        </Link>
      </div>
    );
  }

  const currentStepIndex = TRACKING_STEPS.findIndex((s) => s.status === order.order_status);
  const canCancel =
    order.order_status === 'pending' ||
    order.order_status === 'confirmed' ||
    order.order_status === 'processing';

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-xs text-amazon-blue hover:text-amazon-hover hover:underline font-semibold"
      >
        <ArrowLeft size={14} /> Back to all orders
      </Link>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <div className="text-xs text-gray-500 mt-1">
            Ordered on {formatDate(order.created_at)} • Order # {order.id}
          </div>
        </div>

        {canCancel && (
          <button
            onClick={handleCancelOrder}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 rounded text-xs font-bold transition-colors"
          >
            <Ban size={14} /> Cancel Order
          </button>
        )}
      </div>

      {/* Step Tracking Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Truck size={18} className="text-amazon-orange" />
            <span>Tracking Timeline</span>
            {order.shipment && (
              <span className="text-[11px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                {order.shipment.courier_name} • AWB: {order.shipment.awb_code}
              </span>
            )}
            {order.order_status === 'cancelled' && (
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded ml-2">
                Cancelled
              </span>
            )}
          </h2>

        {order.order_status !== 'cancelled' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {TRACKING_STEPS.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step.status} className="flex flex-col items-center text-center relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-2 ${
                      isPassed
                        ? 'bg-amazon-orange text-gray-950 ring-4 ring-amber-100'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                  >
                    {isPassed ? <CheckCircle size={18} /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-amazon-hover underline'
                        : isPassed
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5">{step.desc}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
            This order has been cancelled upon customer request. If payment was deducted, a refund will reflect in 3-5 business days.
          </div>
        )}
      </div>

      {/* 3-Card Summary Grid: Shipping Address | Payment | Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Shipping Address */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm text-xs space-y-1.5">
          <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-1.5">
            <MapPin size={16} className="text-amazon-orange" /> Shipping Address
          </h3>
          <div className="font-bold text-gray-800">{order.shipping_address?.full_name}</div>
          <div className="text-gray-600">{order.shipping_address?.address_line_1}</div>
          {order.shipping_address?.address_line_2 && (
            <div className="text-gray-600">{order.shipping_address?.address_line_2}</div>
          )}
          <div className="text-gray-600">
            {order.shipping_address?.city}, {order.shipping_address?.state}{' '}
            {order.shipping_address?.postal_code}
          </div>
          <div className="text-gray-600">{order.shipping_address?.country}</div>
          <div className="text-gray-500 pt-1">Phone: {order.shipping_address?.phone}</div>
        </div>

        {/* Payment Method */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm text-xs space-y-1.5">
          <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-1.5">
            <CreditCard size={16} className="text-amazon-orange" /> Payment Info
          </h3>
          <div>
            <span className="text-gray-500">Method: </span>
            <span className="font-bold uppercase text-gray-800">
              {order.payment_method === 'cashfree'
                ? 'Cashfree PG (Simulated / NetBanking / UPI)'
                : order.payment_method === 'cod'
                ? 'Cash on Delivery (COD)'
                : 'Credit Card (Stripe)'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Payment Status: </span>
            <span className="font-semibold text-emerald-700 capitalize">
              {order.payment_status}
            </span>
          </div>
          {order.cashfree_order_id && (
            <div className="font-mono text-[10px] text-gray-400 truncate">
              CF Ref: {order.cashfree_order_id}
            </div>
          )}
          <div className="text-gray-500 pt-2 border-t border-gray-100 text-[11px]">
            Invoices and GST receipts are sent directly to registered email address.
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm text-xs space-y-2">
          <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-1.5">
            <Package size={16} className="text-amazon-orange" /> Order Summary
          </h3>
          <div className="flex justify-between text-gray-600">
            <span>Items Subtotal:</span>
            <span>{formatPrice(order.subtotal_amount || order.total_amount)}</span>
          </div>
          {order.discount_amount && order.discount_amount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Coupon Discount ({order.coupon_code}):</span>
              <span>-{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Shipping & Handling:</span>
            <span>FREE</span>
          </div>
          <hr className="border-gray-200 my-1" />
          <div className="flex justify-between font-bold text-sm text-gray-900">
            <span>Grand Total:</span>
            <span className="text-amazon-hover text-base">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-bold text-base text-gray-900 mb-4">Items in this shipment</h3>
        <div className="space-y-4">
          {order.order_items?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
              <div className="relative w-20 h-20 bg-gray-50 border border-gray-200 rounded overflow-hidden shrink-0">
                {item.product_image && (
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                )}
              </div>
              <div className="flex-1 text-xs">
                <h4 className="font-bold text-gray-900 line-clamp-1">{item.product_name}</h4>
                <div className="text-gray-500 mt-1">
                  Qty: {item.quantity} • Unit Price: {formatPrice(item.unit_price)}
                </div>
                <div className="font-bold text-gray-900 mt-1">
                  Subtotal: {formatPrice(item.subtotal)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

