'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  MapPin,
  Heart,
  ChevronDown,
  Shield,
  LogOut,
  Menu,
  X,
  ArrowRightLeft,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { INITIAL_PRODUCTS } from '@/data/mock-data';

export function Navbar() {
  const router = useRouter();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout, switchRole } = useAuth();

  const [searchCategory, setSearchCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [deliverCity, setDeliverCity] = useState('Mumbai 400001');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [postalInput, setPostalInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Autocomplete & Search History state
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [apiSuggestions, setApiSuggestions] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced API autocomplete query
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setApiSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setApiSuggestions(data.suggestions || []);
        }
      } catch {}
    }, 180);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shopsphere_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch {}

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('shopsphere_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (!searchQuery.trim() && searchCategory === 'all') {
      router.push('/products');
      return;
    }
    saveRecentSearch(searchQuery);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (searchCategory !== 'all') params.set('category', searchCategory);
    router.push(`/search?${params.toString()}`);
  };

  const handleSelectSuggestion = (term: string) => {
    setSearchQuery(term);
    saveRecentSearch(term);
    setIsSearchFocused(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('shopsphere_recent_searches');
    } catch {}
  };

  const handleUpdatePostal = (e: React.FormEvent) => {
    e.preventDefault();
    if (postalInput.trim()) {
      setDeliverCity(`PIN ${postalInput.trim()}`);
      setShowLocationModal(false);
      setPostalInput('');
    }
  };

  // Suggestions matching query
  const matchingSuggestions = searchQuery.trim()
    ? INITIAL_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50 bg-amazon-dark text-white select-none">
      {/* Main Bar */}
      <div className="max-w-[1500px] mx-auto px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link
            href="/"
            className="flex items-baseline gap-1 py-1 px-2 border border-transparent hover:border-white rounded transition-colors group"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
              Shop<span className="text-amazon-orange">Sphere</span>
            </span>
            <span className="text-[10px] text-amazon-yellow font-bold uppercase tracking-wider">
              .in
            </span>
          </Link>
        </div>

        {/* Deliver To Location Selector */}
        <button
          onClick={() => setShowLocationModal(true)}
          className="hidden lg:flex items-center gap-1.5 py-1 px-2 border border-transparent hover:border-white rounded transition-colors text-left"
        >
          <MapPin size={18} className="text-white mt-1 shrink-0" />
          <div className="text-xs leading-tight">
            <span className="text-gray-400 block text-[11px]">
              Deliver to {user?.full_name ? user.full_name.split(' ')[0] : 'Guest'}
            </span>
            <span className="font-bold text-white tracking-tight">{deliverCity}</span>
          </div>
        </button>

        {/* Search Bar with Autocomplete Dropdown */}
        <div ref={searchContainerRef} className="flex-1 max-w-3xl relative">
          <form
            onSubmit={handleSearch}
            className="flex items-center h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amazon-orange"
          >
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="hidden sm:block h-full bg-gray-100 text-gray-800 text-xs px-2.5 font-medium border-r border-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="electronics">Electronics</option>
              <option value="smartphones">Smartphones</option>
              <option value="computers">Computers</option>
              <option value="fashion">Fashion</option>
              <option value="home-and-kitchen">Home & Kitchen</option>
              <option value="books">Books</option>
              <option value="sports">Sports</option>
              <option value="beauty">Beauty</option>
              <option value="accessories">Accessories</option>
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search ShopSphere; open Amazon, Flipkart & eBay listings..."
              className="w-full h-full px-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
            />

            <button
              type="submit"
              aria-label="Submit Search"
              className="h-full px-5 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 flex items-center justify-center transition-colors shrink-0"
            >
              <Search size={20} className="stroke-[2.5]" />
            </button>
          </form>

          {/* Autocomplete & Suggestions Menu */}
          {isSearchFocused && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white text-gray-900 rounded-md shadow-2xl border border-gray-200 py-2 z-50 text-xs">
              {/* API Autocomplete Suggestions */}
              {apiSuggestions.length > 0 && (
                <div className="pb-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 px-3 py-1 block">
                    Marketplace Suggestions
                  </span>
                  {apiSuggestions.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(term)}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center justify-between text-gray-800"
                    >
                      <span className="font-semibold truncate">{term}</span>
                      <Search size={12} className="text-gray-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}

              {/* If query has matches from local catalog */}
              {apiSuggestions.length === 0 && matchingSuggestions.length > 0 && (
                <div className="pb-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 px-3 py-1 block">
                    Product Suggestions
                  </span>
                  {matchingSuggestions.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(prod.name)}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center justify-between"
                    >
                      <span className="font-semibold text-gray-800 truncate">{prod.name}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1 rounded uppercase">
                        {prod.source}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="pt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between px-3 py-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                      <Clock size={11} /> Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[10px] text-gray-400 hover:text-red-600"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(term)}
                      className="w-full text-left px-3 py-1 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                    >
                      <Clock size={12} className="text-gray-400 shrink-0" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Trending searches */}
              <div className="pt-1 border-t border-gray-100">
                <span className="text-[10px] font-bold uppercase text-gray-400 px-3 py-1 flex items-center gap-1">
                  <TrendingUp size={11} /> Popular Trends
                </span>
                {['iPhone 15 Pro Max', 'Sony WH-1000XM5', 'Kindle Paperwhite', 'AirPods Pro 2nd Gen', 'MacBook Air M3'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left px-3 py-1 hover:bg-gray-100 text-gray-600"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Comparison Link */}
          <Link
            href="/compare"
            className="hidden lg:flex items-center gap-1 py-1 px-2 border border-transparent hover:border-white rounded transition-colors text-xs font-semibold text-amber-300"
            title="Side-by-side Product Comparison"
          >
            <ArrowRightLeft size={16} />
            <span>Compare</span>
          </Link>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="hidden sm:flex items-center gap-1 py-1 px-2 border border-transparent hover:border-white rounded transition-colors text-xs font-semibold relative"
          >
            <Heart size={18} className="text-gray-300" />
            <span className="hidden xl:inline">Wishlist</span>
            {wishlistItems.length > 0 && (
              <span className="bg-red-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Account Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
          >
            <Link
              href={user ? '/account' : '/login'}
              className="flex items-center gap-1 py-1 px-2 border border-transparent hover:border-white rounded transition-colors text-left"
            >
              <div className="text-xs leading-tight">
                <span className="text-gray-400 block text-[11px]">
                  Hello, {user?.full_name ? user.full_name.split(' ')[0] : 'sign in'}
                </span>
                <span className="font-bold text-white flex items-center gap-0.5">
                  Account & Lists
                  <ChevronDown size={12} className="text-gray-400" />
                </span>
              </div>
            </Link>

            {/* Dropdown Menu */}
            {isAccountOpen && (
              <div className="absolute right-0 top-full pt-1 w-64 z-50">
                <div className="bg-white text-gray-900 rounded-md shadow-2xl border border-gray-200 py-3 px-4">
                  {!user ? (
                    <div className="text-center pb-3 border-b border-gray-200">
                      <Link
                        href="/login"
                        className="block w-full py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-md text-xs shadow-sm mb-2"
                      >
                        Sign in
                      </Link>
                      <p className="text-xs text-gray-500">
                        New customer?{' '}
                        <Link href="/register" className="text-amazon-blue hover:underline">
                          Start here.
                        </Link>
                      </p>
                    </div>
                  ) : (
                    <div className="pb-2 border-b border-gray-200">
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {user.full_name}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">{user.email}</div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                        Role: <span className="uppercase text-amazon-hover">{user.role}</span>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="py-2 space-y-1 text-xs">
                    <Link
                      href="/account"
                      className="block px-2 py-1.5 rounded hover:bg-gray-100 hover:text-amazon-hover font-medium"
                    >
                      Your Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-2 py-1.5 rounded hover:bg-gray-100 hover:text-amazon-hover font-medium"
                    >
                      Your Orders & Tracking
                    </Link>
                    <Link
                      href="/compare"
                      className="block px-2 py-1.5 rounded hover:bg-gray-100 hover:text-amazon-hover font-medium text-amber-900"
                    >
                      Compare Products
                    </Link>
                    <Link
                      href="/wishlist"
                      className="block px-2 py-1.5 rounded hover:bg-gray-100 hover:text-amazon-hover font-medium"
                    >
                      Your Wishlist ({wishlistItems.length})
                    </Link>

                    {/* Admin Dashboard link */}
                    <Link
                      href="/admin"
                      className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-amber-50 text-amber-900 font-semibold"
                    >
                      <span className="flex items-center gap-1.5">
                        <Shield size={14} className="text-amazon-orange" />
                        Admin Dashboard
                      </span>
                      <span className="text-[10px] bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-bold">
                        Manager
                      </span>
                    </Link>

                    {/* Role Switcher Demo Helper */}
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block px-2 mb-1">
                        Demo Mode Switcher
                      </span>
                      <div className="flex gap-1 px-1">
                        <button
                          type="button"
                          onClick={() => switchRole('customer')}
                          className={`flex-1 py-1 text-[11px] rounded font-semibold transition-colors ${
                            user?.role === 'customer'
                              ? 'bg-amazon-light_dark text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          Customer
                        </button>
                        <button
                          type="button"
                          onClick={() => switchRole('admin')}
                          className={`flex-1 py-1 text-[11px] rounded font-semibold transition-colors ${
                            user?.role === 'admin'
                              ? 'bg-amazon-orange text-gray-950 font-bold'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    {user && (
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-1.5 px-2 py-1.5 mt-2 rounded hover:bg-red-50 text-red-600 font-medium"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <Link
            href="/orders"
            className="hidden md:flex flex-col py-1 px-2 border border-transparent hover:border-white rounded transition-colors text-xs leading-tight"
          >
            <span className="text-gray-400 text-[11px]">Returns</span>
            <span className="font-bold text-white">& Orders</span>
          </Link>

          {/* Cart Icon & Badge */}
          <Link
            href="/cart"
            className="flex items-center gap-1 py-1 px-2 border border-transparent hover:border-white rounded transition-colors relative group"
          >
            <div className="relative">
              <ShoppingCart size={28} className="text-white" />
              <span className="absolute -top-1 left-3.5 bg-amazon-orange text-gray-950 text-xs font-black rounded-full px-1.5 min-w-[20px] text-center leading-tight shadow">
                {itemCount}
              </span>
            </div>
            <span className="hidden sm:inline font-bold text-white text-sm mt-2">
              Cart
            </span>
          </Link>
        </div>
      </div>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-lg max-w-sm w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-base font-bold text-gray-900 mb-1">Choose your location</h3>
            <p className="text-xs text-gray-600 mb-4">
              Select a delivery location to check Indian PIN code serviceability with Shiprocket.
            </p>
            <form onSubmit={handleUpdatePostal} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Enter an Indian PIN code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={postalInput}
                    onChange={(e) => setPostalInput(e.target.value)}
                    placeholder="e.g. 400001, 560001, 110001"
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amazon-yellow hover:bg-amazon-orange font-bold text-xs rounded text-gray-950 shadow-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
