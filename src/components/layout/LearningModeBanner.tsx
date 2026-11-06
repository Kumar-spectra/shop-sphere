'use client';

import React, { useState } from 'react';
import { GraduationCap, Info, X, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export function LearningModeBanner() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="bg-amber-400 text-gray-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-amber-500 shadow-sm">
        <div className="flex items-center gap-2 max-w-[1500px] mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-gray-950 shrink-0" />
            <span className="font-bold">₹0 Learning & Demo Mode Active</span>
            <span className="hidden md:inline text-gray-800 text-[11px]">
              • Simulated Marketplace APIs, Cashfree Payments & Shiprocket Tracking • Zero cost & no real charges
            </span>
          </div>

          <button
            onClick={() => setShowDetails(true)}
            className="flex items-center gap-1 text-[11px] bg-black/10 hover:bg-black/20 px-2 py-0.5 rounded font-bold transition-colors shrink-0"
          >
            <Info size={12} />
            <span>Architecture Info</span>
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-lg max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  ShopSphere ₹0 Learning Mode
                </h3>
                <p className="text-xs text-gray-500">
                  Built for learning full-stack e-commerce without paid subscriptions
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-700 mt-4">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1.5">
                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Marketplace Integrations</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Separated adapter architecture for Amazon Creators, Flipkart Affiliate, and eBay Browse APIs. Runs with realistic simulated catalog data without requiring paid developer credentials.
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1.5">
                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Cashfree Payment Simulator (India)</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Simulates payment outcomes (Success, Failure, and Pending drops) with webhook handling. Never collects real credit card numbers or money.
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1.5">
                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Shiprocket Shipping Simulator</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Simulates Indian PIN code serviceability, courier rates (BlueDart, Delhivery), automated AWB assignment, and realistic dispatch tracking timelines.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-1.5 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded text-xs transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

