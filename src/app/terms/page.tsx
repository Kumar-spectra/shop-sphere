import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Conditions of Use & Sale</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-200 text-xs text-gray-700 space-y-4 leading-relaxed">
        <p>
          Welcome to ShopSphere.in. ShopSphere Services LLC and its affiliates provide website features and other products and services to you when you visit or shop at ShopSphere.in.
        </p>
        <h2 className="font-bold text-gray-900 text-sm">1. Electronic Communications</h2>
        <p>
          When you use ShopSphere Services or send e-mails, text messages, and other communications from your desktop or mobile device to us, you may be communicating with us electronically.
        </p>
        <h2 className="font-bold text-gray-900 text-sm">2. Copyright & Trademarks</h2>
        <p>
          All content included in or made available through any ShopSphere Service, such as text, graphics, logos, button icons, images, audio clips, and data compilations is the property of ShopSphere or its content suppliers.
        </p>
        <h2 className="font-bold text-gray-900 text-sm">3. Pricing & Availability</h2>
        <p>
          Except where noted otherwise, the List Price or Recommended Price represents the full retail price listed on the product itself. All prices are listed in Indian Rupees (₹).
        </p>
      </div>
      <div className="mt-6">
        <Link href="/" className="text-xs font-bold text-amazon-blue hover:underline">
          ← Return to Homepage
        </Link>
      </div>
    </div>
  );
}

