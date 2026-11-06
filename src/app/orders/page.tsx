'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, Truck, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shopsphere_user_orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        // Sample seed order for new users so the page never looks empty
        const sampleOrder: Order = {
          id: 'ORD-2026-98124',
          user_id: user?.id || 'demo-user-123',
          total_amount: 24990,
          shipping_address: {
            full_name: 'Rahul Kumar',
            phone: '+91 98765 43210',
            address_line_1: 'Flat 402, Sea Green Apartments',
            city: 'Mumbai',
            state: 'Maharashtra',
            postal_code: '400050',
            country: 'India',
          },
          payment_method: 'cod',
          payment_status: 'paid',
          order_status: 'delivered',
          created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
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
        };
        setOrders([sampleOrder]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-500">Loading your orders...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <Link href="/account" className="hover:underline">
          Your Account
        </Link>
        <span>›</span>
        <span className="font-bold text-gray-800">Your Orders</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
        <span className="text-xs text-gray-500">{orders.length} orders placed</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
          <Package size={40} className="text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-800 mb-1">No orders placed yet</h2>
          <p className="text-xs text-gray-500 mb-6">
            Looking for something? Check out top deals and best-selling tech.
          </p>
          <Link
            href="/products"
            className="px-6 py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-full text-xs shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const isDelivered = order.order_status === 'delivered';
            const isCancelled = order.order_status === 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                {/* Order Top Summary Bar */}
                <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                    <div>
                      <span className="text-gray-500 uppercase font-semibold text-[10px] block">
                        Order Placed
                      </span>
                      <span className="font-bold text-gray-800">{formatDate(order.created_at)}</span>
                    </div>

                    <div>
                      <span className="text-gray-500 uppercase font-semibold text-[10px] block">
                        Total Amount
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500 uppercase font-semibold text-[10px] block">
                        Ship To
                      </span>
                      <span className="font-bold text-gray-800">
                        {order.shipping_address?.full_name || 'Customer'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-gray-500 uppercase font-semibold text-[10px] block">
                      Order # {order.id}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-amazon-blue hover:text-amazon-hover hover:underline font-bold"
                    >
                      View Order Details ›
                    </Link>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck
                      size={18}
                      className={
                        isDelivered
                          ? 'text-emerald-600'
                          : isCancelled
                          ? 'text-red-600'
                          : 'text-amazon-orange'
                      }
                    />
                    <h3 className="font-bold text-sm capitalize text-gray-900">
                      Status: {order.order_status.replace('_', ' ')}
                    </h3>
                  </div>

                  {/* Items list */}
                  <div className="space-y-4">
                    {order.order_items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-50 border border-gray-100 rounded overflow-hidden shrink-0">
                          {item.product_image && (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                            />
                          )}
                        </div>

                        <div className="flex-1 text-xs">
                          <h4 className="font-bold text-gray-900 line-clamp-1">
                            {item.product_name}
                          </h4>
                          <div className="text-gray-500 mt-0.5">
                            Qty: {item.quantity} • {formatPrice(item.unit_price)} each
                          </div>
                          <span className="text-amazon-blue hover:underline cursor-pointer font-medium mt-1 inline-block">
                            Buy it again
                          </span>
                        </div>

                        <div className="shrink-0 text-right">
                          <Link
                            href={`/orders/${order.id}`}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-semibold hover:bg-gray-50 text-gray-800"
                          >
                            Track Package
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

