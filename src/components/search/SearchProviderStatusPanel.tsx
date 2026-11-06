import React from 'react';
import Link from 'next/link';
import { ExternalLink, CheckCircle2, AlertCircle, Clock, Zap, Search } from 'lucide-react';
import { ProviderSearchResult } from '@/lib/providers/provider-types';

interface SearchProviderStatusPanelProps {
  query: string;
  providers: ProviderSearchResult[];
  executionTimeMs: number;
  totalProducts: number;
}

export const SearchProviderStatusPanel: React.FC<SearchProviderStatusPanelProps> = ({
  query,
  providers,
  executionTimeMs,
  totalProducts,
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-5 shadow-sm text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500" />
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amazon-yellow" />
            Marketplace Search
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">
            <strong className="text-slate-900">{totalProducts}</strong> ShopSphere/API products; external marketplaces open in their own sites
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Aggregated in {executionTimeMs}ms</span>
        </div>
      </div>

      {/* Provider Status Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {providers.map((p) => {
          const isLive = p.isLive;
          const isConfigured = p.isConfigured;
          const isExternalLinkOnly = p.providerId !== 'shopsphere' && !isConfigured && Boolean(p.liveSearchUrl);
          const statusLabel = p.providerId === 'shopsphere' ? 'Local catalog' : isLive ? 'API live' : isExternalLinkOnly ? 'Search link' : isConfigured ? 'API error' : 'Unavailable';

          return (
            <div
              key={p.providerId}
              className={`rounded border p-2 flex flex-col justify-between ${
                isLive
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-800 truncate" title={p.providerName}>
                  {p.providerId === 'amazon'
                    ? '🛒 Amazon'
                    : p.providerId === 'flipkart'
                    ? '📦 Flipkart'
                    : p.providerId === 'ebay'
                    ? '🌐 eBay'
                    : '⚡ ShopSphere'}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 ${isLive ? 'bg-emerald-100 text-emerald-800' : isExternalLinkOnly ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'}`}>
                  {isLive ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                  {statusLabel}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 mb-1.5">
                <span>{isExternalLinkOnly ? 'Open marketplace search' : `${p.totalFound} results`}</span>
                <span className="mx-1">•</span>
                <span>{p.responseTimeMs}ms</span>
              </div>

              {!isConfigured && !isExternalLinkOnly && p.missingCredentials.length > 0 && (
                <div className="text-[10px] text-slate-400 truncate mb-1" title={`Missing: ${p.missingCredentials.join(', ')}`}>
                  Missing: {p.missingCredentials[0]}
                </div>
              )}

              {p.liveSearchUrl && (
                <a
                  href={p.liveSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline pt-1 border-t border-slate-100"
                >
                  <Search className="w-2.5 h-2.5" />
                  {isExternalLinkOnly ? `Search on ${p.providerName}` : `Open ${p.providerName}`}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
        External marketplace links open their own websites. Their live prices, stock, images and ratings are not imported into ShopSphere unless an official API is connected.
      </p>
    </div>
  );
};

