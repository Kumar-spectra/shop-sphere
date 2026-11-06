'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShieldAlert, Sparkles, Flame, Tag } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/data/mock-data';

export function SecondaryNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="bg-amazon-light_dark text-white text-xs font-medium border-t border-gray-700 select-none">
        <div className="max-w-[1500px] mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar py-1.5 gap-2">
          {/* All Menu Trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 py-1 px-2 hover:border hover:border-white rounded shrink-0 font-bold"
          >
            <Menu size={18} />
            <span>All Categories</span>
          </button>

          {/* Quick Category / Feature links */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto whitespace-nowrap">
            <Link
              href="/products?deals=true"
              className="flex items-center gap-1 py-1 px-2 hover:border hover:border-white rounded transition-colors text-amber-300 font-bold"
            >
              <Tag size={13} /> Today's Deals
            </Link>
            <Link
              href="/products?sort=rating"
              className="flex items-center gap-1 py-1 px-2 hover:border hover:border-white rounded transition-colors text-orange-300 font-bold"
            >
              <Flame size={13} /> Best Sellers
            </Link>
            <Link
              href="/products?category=electronics"
              className="py-1 px-2 hover:border hover:border-white rounded transition-colors"
            >
              Electronics
            </Link>
            <Link
              href="/products?category=smartphones"
              className="py-1 px-2 hover:border hover:border-white rounded transition-colors"
            >
              Smartphones
            </Link>
            <Link
              href="/products?category=computers"
              className="py-1 px-2 hover:border hover:border-white rounded transition-colors"
            >
              Computers
            </Link>
            <Link
              href="/products?category=fashion"
              className="py-1 px-2 hover:border hover:border-white rounded transition-colors"
            >
              Fashion
            </Link>
            <Link
              href="/products?category=home-and-kitchen"
              className="py-1 px-2 hover:border hover:border-white rounded transition-colors"
            >
              Home & Kitchen
            </Link>
            <Link
              href="/products?category=books"
              className="py-1 px-2 hover:border hover:border-white rounded transition-colors"
            >
              Books
            </Link>
            <Link
              href="/products?category=sports"
              className="py-1 px-2 hover:border hover:border-white rounded transition-colors"
            >
              Sports
            </Link>
          </div>

          {/* Right Banner / Admin Badge */}
          <div className="shrink-0 hidden md:flex items-center gap-2">
            <Link
              href="/admin"
              className="flex items-center gap-1 text-[11px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 px-2 py-0.5 rounded font-semibold transition-colors"
            >
              <ShieldAlert size={12} />
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Side Drawer for All Categories */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 text-gray-900 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="bg-amazon-light_dark text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amazon-orange" />
                <span className="font-bold text-base">Browse ShopSphere</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-300 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Shop by Department
                </h4>
                <ul className="space-y-1">
                  {INITIAL_CATEGORIES.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="block px-3 py-2 rounded hover:bg-gray-100 font-medium text-gray-700 hover:text-amazon-hover transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Programs & Features
                </h4>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/products?deals=true"
                      onClick={() => setDrawerOpen(false)}
                      className="block px-3 py-2 rounded hover:bg-gray-100 font-medium text-gray-700"
                    >
                      Today's Deals & Discounts
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?sort=rating"
                      onClick={() => setDrawerOpen(false)}
                      className="block px-3 py-2 rounded hover:bg-gray-100 font-medium text-gray-700"
                    >
                      Top Customer Rated
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      onClick={() => setDrawerOpen(false)}
                      className="block px-3 py-2 rounded hover:bg-gray-100 font-medium text-gray-700"
                    >
                      Your Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wishlist"
                      onClick={() => setDrawerOpen(false)}
                      className="block px-3 py-2 rounded hover:bg-gray-100 font-medium text-gray-700"
                    >
                      Your Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setDrawerOpen(false)}
                      className="block px-3 py-2 rounded bg-amber-50 text-amber-900 font-semibold"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

