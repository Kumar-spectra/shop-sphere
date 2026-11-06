'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Heart,
  Shield,
  MapPin,
  Lock,
  LogOut,
  Check,
  CreditCard,
  Edit2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, updateProfile, switchRole, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(fullName, phone);
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Your Account</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your personal profile, addresses, orders, and security settings
          </p>
        </div>

        {/* Role toggle badge */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg border border-gray-200">
          <span className="text-xs font-semibold text-gray-600 pl-2">Current Mode:</span>
          <button
            onClick={() => switchRole('customer')}
            className={`px-3 py-1 text-xs rounded-md font-bold transition-colors ${
              user?.role === 'customer'
                ? 'bg-amazon-light_dark text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={`px-3 py-1 text-xs rounded-md font-bold transition-colors ${
              user?.role === 'admin'
                ? 'bg-amazon-orange text-gray-950'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2 font-medium">
          <Check size={16} /> Profile updated successfully!
        </div>
      )}

      {/* Main Grid of 6 Account Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Your Orders */}
        <Link
          href="/orders"
          className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group"
        >
          <div className="p-3 bg-amber-50 rounded-full text-amazon-orange shrink-0 group-hover:scale-110 transition-transform">
            <Package size={26} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 group-hover:text-amazon-hover">
              Your Orders
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Track packages, view past order invoices, and manage cancelations.
            </p>
          </div>
        </Link>

        {/* Card 2: Your Wishlist */}
        <Link
          href="/wishlist"
          className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group"
        >
          <div className="p-3 bg-red-50 rounded-full text-red-500 shrink-0 group-hover:scale-110 transition-transform">
            <Heart size={26} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 group-hover:text-amazon-hover">
              Your Wishlist
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Explore saved items, move products to cart, and organize lists.
            </p>
          </div>
        </Link>

        {/* Card 3: Admin Portal */}
        <Link
          href="/admin"
          className="bg-white border border-amber-200 bg-amber-50/20 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group"
        >
          <div className="p-3 bg-amber-100 rounded-full text-amber-700 shrink-0 group-hover:scale-110 transition-transform">
            <Shield size={26} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 group-hover:text-amazon-hover flex items-center gap-1.5">
              Admin Portal
              <span className="text-[10px] bg-amazon-orange text-gray-950 px-1.5 py-0.2 rounded font-black">
                STAFF
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Manage inventory, add products, view store metrics, and fulfill orders.
            </p>
          </div>
        </Link>
      </div>

      {/* Profile Details & Saved Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Details Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <User size={18} className="text-amazon-orange" />
              <span>Login & Security Profile</span>
            </h2>
            {!isEditing && (
              <button
                onClick={() => {
                  setFullName(user?.full_name || '');
                  setPhone(user?.phone || '');
                  setIsEditing(true);
                }}
                className="text-xs text-amazon-blue hover:text-amazon-hover hover:underline flex items-center gap-1 font-semibold"
              >
                <Edit2 size={13} /> Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-500 block">Name:</span>
                <span className="font-bold text-gray-900 text-sm">
                  {user?.full_name || 'Rahul Kumar'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Email:</span>
                <span className="font-semibold text-gray-800">
                  {user?.email || 'demo@shopsphere.in'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Mobile Phone Number:</span>
                <span className="font-semibold text-gray-800">
                  {user?.phone || '+91 98765 43210'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Role & Permissions:</span>
                <span className="uppercase font-black text-amazon-hover tracking-wider">
                  {user?.role || 'customer'}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amazon-yellow hover:bg-amazon-orange font-bold text-gray-950 rounded text-xs"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Default Shipping Address Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin size={18} className="text-amazon-orange" />
              <span>Default Shipping Address</span>
            </h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              DEFAULT
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-gray-700">
            <div className="font-bold text-sm text-gray-900">
              {user?.full_name || 'Rahul Kumar'}
            </div>
            <div>Flat 402, Sea Green Apartments, Bandra West</div>
            <div>Near Hill Road</div>
            <div>Mumbai, Maharashtra 400050</div>
            <div>India</div>
            <div className="text-gray-500 pt-1">
              Phone: {user?.phone || '+91 98765 43210'}
            </div>
          </div>
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md text-xs font-bold transition-colors"
        >
          <LogOut size={15} /> Sign Out of All Sessions
        </button>
      </div>
    </div>
  );
}

