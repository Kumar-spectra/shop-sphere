'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    const res = await register(email, password, name);
    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8">
      <Link href="/" className="mb-6 text-3xl font-black text-amazon-dark">
        Shop<span className="text-amazon-orange">Sphere</span>
        <span className="text-xs font-bold text-gray-500 ml-1">.in</span>
      </Link>

      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h1>

        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-800 mb-1">Your name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last name"
              className="w-full px-3 py-2 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Email *</label>
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
            <label className="block font-bold text-gray-800 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 mt-0.5 block">
              Passwords must be at least 6 characters.
            </span>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Re-enter password *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-3 py-2 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-md shadow-sm transition-colors text-xs disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Create your ShopSphere account'}
          </button>
        </form>

        <p className="text-[11px] text-gray-600 mt-4 leading-relaxed">
          By creating an account, you agree to ShopSphere's{' '}
          <Link href="/terms" className="text-amazon-blue hover:underline">
            Conditions of Use
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-amazon-blue hover:underline">
            Privacy Notice
          </Link>
          .
        </p>

        <div className="mt-5 pt-4 border-t border-gray-200 text-xs">
          Already have an account?{' '}
          <Link href="/login" className="text-amazon-blue hover:underline font-bold">
            Sign in ›
          </Link>
        </div>
      </div>
    </div>
  );
}

