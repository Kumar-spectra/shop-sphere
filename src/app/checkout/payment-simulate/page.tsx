'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  CreditCard,
  Building2,
  RefreshCcw,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';

function SimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || `ORD-${Date.now()}`;
  const cfOrderId = searchParams.get('cf_order_id') || `cf_sim_${Date.now()}`;

  const [simulatedState, setSimulatedState] = useState<'idle' | 'success' | 'failed' | 'pending'>('idle');
  const [processing, setProcessing] = useState(false);

  const updateLocalOrder = (status: 'paid' | 'failed' | 'pending', orderStatus: 'confirmed' | 'pending') => {
    try {
      const stored = localStorage.getItem('shopsphere_user_orders');
      if (stored) {
        const orders: Order[] = JSON.parse(stored);
        const updated = orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                payment_status: status,
                order_status: orderStatus,
                cashfree_order_id: cfOrderId,
                updated_at: new Date().toISOString(),
              }
            : o
        );
        localStorage.setItem('shopsphere_user_orders', JSON.stringify(updated));
      }
    } catch {}
  };

  const handleSimulateOutcome = async (outcome: 'success' | 'failed' | 'pending') => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 800)); // realistic latency simulation

    if (outcome === 'success') {
      updateLocalOrder('paid', 'confirmed');
      setSimulatedState('success');
      setTimeout(() => {
        router.push(`/checkout/success?order_id=${orderId}&method=cashfree`);
      }, 1200);
    } else if (outcome === 'failed') {
      updateLocalOrder('failed', 'pending');
      setSimulatedState('failed');
      setProcessing(false);
    } else {
      updateLocalOrder('pending', 'pending');
      setSimulatedState('pending');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
        {/* Cashfree Simulated Header */}
        <div className="bg-[#1F2937] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-sm">
              CF
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Cashfree Payments (Sandbox)</h1>
              <span className="text-[10px] text-amber-300 font-semibold block">
                ₹0 Learning Simulator • Zero Real Charges
              </span>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
            SECURE
          </span>
        </div>

        {/* Order Info */}
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 text-xs">
            <div>
              <span className="text-gray-500 block">Merchant:</span>
              <strong className="text-gray-900 text-sm">ShopSphere India Pvt Ltd</strong>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block">Order Ref:</span>
              <span className="font-mono text-gray-800">{orderId}</span>
            </div>
          </div>

          {/* Educational Note */}
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <AlertTriangle size={15} className="text-amber-600" />
              <span>Interactive Educational Payment Simulator</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Select an outcome below to test and learn how ShopSphere handles each payment scenario (Success, Failure, or Pending dropped payment) without needing real merchant credentials.
            </p>
          </div>

          {/* Outcome Simulation State Display */}
          {simulatedState === 'success' && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-center space-y-2 text-emerald-800 text-xs">
              <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
              <div className="font-bold text-sm">Payment Successful!</div>
              <p className="text-[11px]">
                Redirecting to order confirmation and dispatching Shiprocket shipment...
              </p>
            </div>
          )}

          {simulatedState === 'failed' && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg space-y-2 text-red-800 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm">
                <XCircle size={20} className="text-red-600" />
                <span>Simulated Payment Failed (Bank Server Busy / Card Declined)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The payment attempt was declined by the simulated issuing bank. Your order remains in 'Pending' state so no items were lost.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSimulatedState('idle')}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs flex items-center gap-1"
                >
                  <RefreshCcw size={13} /> Try Again
                </button>
                <Link
                  href="/checkout"
                  className="px-3 py-1.5 border border-red-300 hover:bg-red-100 font-bold rounded text-xs"
                >
                  Change Payment Method
                </Link>
              </div>
            </div>
          )}

          {simulatedState === 'pending' && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg space-y-2 text-amber-900 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Clock size={20} className="text-amber-600" />
                <span>Simulated Payment Pending (Awaiting Bank Confirmation)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Cashfree has marked the payment as pending. In production, a signed webhook updates this order automatically once confirmed.
              </p>
              <Link
                href="/orders"
                className="inline-block px-3 py-1.5 bg-amber-600 text-white font-bold rounded text-xs"
              >
                View Order in History
              </Link>
            </div>
          )}

          {/* Outcome Simulator Buttons */}
          {simulatedState === 'idle' && (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={processing}
                onClick={() => handleSimulateOutcome('success')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                <span>Simulate Successful Payment (200 OK)</span>
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={() => handleSimulateOutcome('failed')}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <XCircle size={16} />
                <span>Simulate Failed Payment (Card Declined / Timeout)</span>
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={() => handleSimulateOutcome('pending')}
                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Clock size={16} />
                <span>Simulate Pending / User Dropped Payment</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-4 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              256-bit Bank Grade Security
            </span>
            <Link href="/checkout" className="text-gray-500 hover:underline">
              Cancel & Return to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSimulatePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading payment gateway simulator...</div>}>
      <SimulatorContent />
    </Suspense>
  );
}

