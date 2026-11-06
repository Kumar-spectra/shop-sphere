'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-8">
      <Link href="/" className="mb-6 text-3xl font-black text-amazon-dark">
        Shop<span className="text-amazon-orange">Sphere</span>
        <span className="text-xs font-bold text-gray-500 ml-1">.in</span>
      </Link>

      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Password assistance</h1>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Enter the email address associated with your ShopSphere account, and we'll send a password reset verification link.
        </p>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Password Reset Email Sent</span>
            </div>
            <p>
              If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
            </p>
            <Link href="/login" className="text-amazon-blue hover:underline font-bold block pt-2">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Email address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-md shadow-sm transition-colors text-xs"
            >
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

