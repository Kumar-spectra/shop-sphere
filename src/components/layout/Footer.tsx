'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-amazon-dark text-white text-xs mt-16 select-none">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] py-4 text-center text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
      >
        <ArrowUp size={16} /> Back to top
      </button>

      {/* Main footer navigation columns */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-sm text-white mb-3">Get to Know Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/about" className="hover:underline">
                About ShopSphere
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/press" className="hover:underline">
                Press Releases
              </Link>
            </li>
            <li>
              <Link href="/science" className="hover:underline">
                ShopSphere Science
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Connect with Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline">
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Make Money with Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/admin" className="hover:underline text-amber-300 font-semibold">
                Sell on ShopSphere (Admin)
              </Link>
            </li>
            <li>
              <Link href="/affiliates" className="hover:underline">
                Become an Affiliate
              </Link>
            </li>
            <li>
              <Link href="/fulfillment" className="hover:underline">
                Fulfillment by ShopSphere
              </Link>
            </li>
            <li>
              <Link href="/advertise" className="hover:underline">
                Advertise Your Products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Let Us Help You</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/account" className="hover:underline">
                Your Account
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:underline">
                Returns Centre & Tracking
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:underline">
                100% Purchase Protection
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:underline">
                Help & FAQs
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Middle Brand and Locale selector bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 text-gray-300">
          <Link href="/" className="text-xl font-black text-white">
            Shop<span className="text-amazon-orange">Sphere</span>
          </Link>

          <div className="flex items-center gap-2 border border-gray-600 rounded px-3 py-1.5 text-xs text-gray-300 hover:border-gray-400 cursor-pointer">
            <Globe size={14} />
            <span>English</span>
          </div>

          <div className="flex items-center gap-2 border border-gray-600 rounded px-3 py-1.5 text-xs text-gray-300 hover:border-gray-400 cursor-pointer">
            <span>₹ INR - Indian Rupee</span>
          </div>

          <div className="flex items-center gap-1.5 border border-gray-600 rounded px-3 py-1.5 text-xs text-gray-300 hover:border-gray-400 cursor-pointer">
            <span className="text-sm">🇮🇳</span>
            <span>India</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="bg-[#131A22] py-8 text-center text-[11px] text-gray-400 space-y-2">
        <div className="flex flex-wrap justify-center gap-4 text-gray-300">
          <Link href="/terms" className="hover:underline">
            Conditions of Use & Sale
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Notice
          </Link>
          <Link href="/interest-based-ads" className="hover:underline">
            Interest-Based Ads
          </Link>
        </div>
        <p>© 2026 ShopSphere, Inc. or its affiliates. All rights reserved.</p>
        <p className="text-[10px] text-gray-500">
          Portfolio full-stack e-commerce demonstration built with Next.js, TypeScript, Tailwind CSS, Supabase & Stripe.
        </p>
      </div>
    </footer>
  );
}

