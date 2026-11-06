'use client';

import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="bg-gradient-to-r from-amazon-light_dark to-amazon-dark text-white rounded-lg p-8 text-center max-w-4xl mx-auto shadow-md">
      <Sparkles className="mx-auto text-amazon-orange mb-2" size={32} />
      <h3 className="text-2xl font-black mb-2">Subscribe to ShopSphere Prime Insider</h3>
      <p className="text-sm text-gray-300 max-w-lg mx-auto mb-6">
        Get personalized discounts, early access to lightning deals, and exclusive promotional vouchers directly to your inbox.
      </p>

      {subscribed ? (
        <div className="inline-flex items-center gap-2 bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 px-4 py-2 rounded-full text-xs font-bold">
          <Check size={16} /> Thank you for subscribing! Check your inbox for exclusive deals.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full sm:w-80 px-4 py-2.5 rounded-md text-sm text-gray-900 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold text-sm rounded-md transition-colors shrink-0"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

