'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      router.push('/');
    }
  };

  const handleQuickDemoLogin = async (role: 'customer' | 'admin') => {
    setIsSubmitting(true);
    const demoEmail = role === 'admin' ? 'admin@shopsphere.in' : 'customer@shopsphere.in';
    await login(demoEmail, 'Demo@123456');
    router.push(role === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Brand Logo */}
      <Link href="/" className="mb-6 text-3xl font-black text-amazon-dark">
        Shop<span className="text-amazon-orange">Sphere</span>
        <span className="text-xs font-bold text-gray-500 ml-1">.in</span>
      </Link>

      {/* Login Box */}
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in</h1>

        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              Email or mobile phone number
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3 py-2 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-800">Password</label>
              <Link
                href="/forgot-password"
                className="text-amazon-blue hover:text-amazon-hover hover:underline text-[11px]"
              >
                Forgot your password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-md shadow-sm transition-colors text-xs disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-[11px] text-gray-600 mt-4 leading-relaxed">
          By continuing, you agree to ShopSphere's{' '}
          <Link href="/terms" className="text-amazon-blue hover:underline">
            Conditions of Use
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-amazon-blue hover:underline">
            Privacy Notice
          </Link>
          .
        </p>

        {/* Quick Demo Access Bar */}
        <div className="mt-5 pt-4 border-t border-gray-200">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2 text-center">
            Instant Demo Sign-in
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer')}
              className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-bold text-xs"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="flex-1 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded font-bold text-xs"
            >
              Admin Demo
            </button>
          </div>
        </div>
      </div>

      {/* New customer? Create account */}
      <div className="w-full max-w-sm mt-6 text-center">
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-300" />
          <span className="flex-shrink mx-3 text-xs text-gray-500">New to ShopSphere?</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <Link
          href="/register"
          className="block w-full py-2 border border-gray-300 hover:bg-gray-50 rounded-md text-xs font-bold text-gray-800 shadow-sm mt-2 transition-colors"
        >
          Create your ShopSphere account
        </Link>
      </div>
    </div>
  );
}

