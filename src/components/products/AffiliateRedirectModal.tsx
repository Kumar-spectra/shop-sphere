'use client';

import React from 'react';
import { ExternalLink, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '@/types';

interface AffiliateRedirectModalProps {
  product: Product | null;
  onClose: () => void;
}

export function AffiliateRedirectModal({ product, onClose }: AffiliateRedirectModalProps) {
  if (!product || product.source === 'shopsphere') return null;

  const providerNames: Record<string, string> = {
    amazon: 'Amazon.in',
    flipkart: 'Flipkart',
    ebay: 'eBay Marketplace',
  };

  const providerName = providerNames[product.source] || 'External Marketplace';
  const targetUrl = product.affiliate_url || '#';

  const handleProceed = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white text-gray-900 rounded-lg max-w-md w-full p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
            <ExternalLink size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-gray-900">
              Continue to {providerName}
            </h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Authorized Marketplace Partner
            </span>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4 text-xs space-y-1">
          <div className="font-bold text-gray-900 line-clamp-1">{product.name}</div>
          <div className="text-gray-500">Fulfilled by: {product.seller_name || providerName}</div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          You are being redirected to <strong>{providerName}</strong> to finalize this order directly on their platform. As an affiliate partner, ShopSphere helps you discover the best prices across platforms and may earn a commission on qualifying purchases at zero extra cost to you.
        </p>

        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mb-5">
          <ShieldCheck size={14} /> Official Verified Partner Redirect
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded"
          >
            Stay on ShopSphere
          </button>
          <button
            onClick={handleProceed}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-amazon-yellow hover:bg-amazon-orange text-gray-950 rounded shadow-sm transition-colors"
          >
            Go to {providerName} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

