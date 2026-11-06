import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">About ShopSphere</h1>
      <p className="text-sm text-gray-700 leading-relaxed mb-6">
        ShopSphere is an advanced, production-style e-commerce platform inspired by Amazon's world-class customer obsession, streamlined catalog discovery, fast delivery logistics, and secure checkout experience.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600">
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h2 className="font-bold text-gray-900 text-sm mb-2">Our Mission</h2>
          <p>
            To be Earth's most customer-centric shopping destination where customers can find and discover virtually anything they want to buy online at the best prices with unmatched convenience.
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h2 className="font-bold text-gray-900 text-sm mb-2">Modern Architecture</h2>
          <p>
            Powered by Next.js App Router, React 19, TypeScript, Tailwind CSS, Supabase PostgreSQL with Row-Level Security, and Stripe test checkout integration.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <Link href="/products" className="text-xs font-bold text-amazon-blue hover:underline">
          ← Back to ShopSphere Store
        </Link>
      </div>
    </div>
  );
}

