import React from 'react';
import Link from 'next/link';
import { HelpCircle, Package, RefreshCw, ShieldCheck, PhoneCall } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Hello. What can we help you with?</h1>
      <p className="text-xs text-gray-500 mb-8">
        Find answers to frequently asked questions regarding your orders, returns, and account.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <Link
          href="/orders"
          className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex items-start gap-3"
        >
          <Package className="text-amazon-orange shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Your Orders</h3>
            <p className="text-gray-500 mt-1">Track packages, cancel orders, or view past invoices.</p>
          </div>
        </Link>

        <Link
          href="/orders"
          className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex items-start gap-3"
        >
          <RefreshCw className="text-amazon-orange shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Returns & Refunds</h3>
            <p className="text-gray-500 mt-1">Return or replace items with 7-day hassle-free policy.</p>
          </div>
        </Link>

        <Link
          href="/account"
          className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex items-start gap-3"
        >
          <ShieldCheck className="text-amazon-orange shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Account Settings</h3>
            <p className="text-gray-500 mt-1">Change email, passwords, or delivery addresses.</p>
          </div>
        </Link>

        <div className="p-4 bg-white border border-gray-200 rounded-lg flex items-start gap-3">
          <PhoneCall className="text-amazon-orange shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Customer Care</h3>
            <p className="text-gray-500 mt-1">24/7 toll-free support helpline: 1800-3000-9009</p>
          </div>
        </div>
      </div>
    </div>
  );
}

