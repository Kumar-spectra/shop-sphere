import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">ShopSphere Privacy Notice</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-200 text-xs text-gray-700 space-y-4 leading-relaxed">
        <p>
          We know that you care how information about you is used and shared, and we appreciate your trust that we will do so carefully and sensibly.
        </p>
        <h2 className="font-bold text-gray-900 text-sm">Personal Information We Collect</h2>
        <p>
          We collect your personal information in order to provide and continually improve our products and services. We do not sell your personal information to third parties.
        </p>
        <h2 className="font-bold text-gray-900 text-sm">Security of Information</h2>
        <p>
          We design our systems with your security and privacy in mind. We maintain physical, electronic, and procedural safeguards in connection with the collection, storage, and disclosure of personal customer information.
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

