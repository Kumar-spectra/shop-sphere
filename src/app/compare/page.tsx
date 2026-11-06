'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2, ShoppingCart, ExternalLink, Star, ArrowRightLeft } from 'lucide-react';
import { Product } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mock-data';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { AffiliateRedirectModal } from '@/components/products/AffiliateRedirectModal';

export default function ComparePage() {
  const { addToCart } = useCart();
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [selectedAffiliateProduct, setSelectedAffiliateProduct] = useState<Product | null>(null);

  useEffect(() => {
    try {
      const storedIds: string[] = JSON.parse(
        localStorage.getItem('shopsphere_compare_ids') || '[]'
      );
      if (storedIds.length > 0) {
        const matches = INITIAL_PRODUCTS.filter((p) => storedIds.includes(p.id));
        setComparedProducts(matches);
      } else {
        // Default popular flagship smartphone & electronics comparison
        const defaults = INITIAL_PRODUCTS.filter((p) =>
          ['p1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000007', 'amz-prod-001'].includes(p.id)
        );
        setComparedProducts(defaults);
      }
    } catch {}
  }, []);

  const handleRemove = (id: string) => {
    const updated = comparedProducts.filter((p) => p.id !== id);
    setComparedProducts(updated);
    try {
      localStorage.setItem(
        'shopsphere_compare_ids',
        JSON.stringify(updated.map((p) => p.id))
      );
    } catch {}
  };

  const clearAll = () => {
    setComparedProducts([]);
    try {
      localStorage.removeItem('shopsphere_compare_ids');
    } catch {}
  };

  // Collect all unique specification keys across compared products
  const allSpecKeys = Array.from(
    new Set(
      comparedProducts.flatMap((p) => (p.specifications ? Object.keys(p.specifications) : []))
    )
  );

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <Link
            href="/products"
            className="text-xs text-amazon-blue hover:underline flex items-center gap-1 font-semibold mb-1"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <ArrowRightLeft className="text-amazon-orange" size={26} />
            Product Comparison
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Compare prices, specs, ratings and sellers across ShopSphere and partner marketplaces
          </p>
        </div>

        {comparedProducts.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            <Trash2 size={14} /> Clear Comparison
          </button>
        )}
      </div>

      {comparedProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
          <ArrowRightLeft size={36} className="text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-800 mb-1">No products to compare</h2>
          <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">
            Browse our catalog and click the comparison icon on any card to add items here.
          </p>
          <Link
            href="/products"
            className="px-6 py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-full text-xs shadow-sm inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-4 w-44 font-bold text-gray-500 uppercase tracking-wider text-[11px]">
                  Product
                </th>
                {comparedProducts.map((p) => (
                  <th key={p.id} className="p-4 min-w-[240px] max-w-[280px] align-top">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded">
                        {p.source.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleRemove(p.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="relative w-full h-36 bg-white rounded border border-gray-200 mb-2 overflow-hidden flex items-center justify-center">
                      <Image
                        src={p.image_urls[0]}
                        alt={p.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <Link
                      href={`/products/${p.slug}`}
                      className="font-bold text-gray-900 hover:text-amazon-hover line-clamp-2 leading-snug mb-2 block"
                    >
                      {p.name}
                    </Link>

                    {/* Action Button */}
                    {p.source === 'shopsphere' ? (
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="w-full py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded-full flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ShoppingCart size={14} /> Add to Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedAffiliateProduct(p)}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 font-bold rounded-full flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink size={14} /> Buy on {p.source.toUpperCase()}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {/* Row: Price */}
              <tr className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-700 bg-gray-50/80">Price</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-extrabold text-base text-gray-900">
                    {formatPrice(p.discount_price ?? p.price)}
                    {p.discount_price && (
                      <span className="text-xs text-gray-400 font-normal line-through ml-2">
                        {formatPrice(p.price)}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row: Rating */}
              <tr className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-700 bg-gray-50/80">Customer Rating</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-900">{p.rating?.toFixed(1) || '4.8'}</span>
                      <span className="text-gray-500 text-[11px]">
                        ({p.review_count || 100} reviews)
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row: Brand */}
              <tr className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-700 bg-gray-50/80">Brand</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-gray-800">
                    {p.brand}
                  </td>
                ))}
              </tr>

              {/* Row: Seller / Source */}
              <tr className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-700 bg-gray-50/80">Seller / Source</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-gray-700">
                    <span className="font-semibold block">{p.seller_name || p.source}</span>
                    <span className="text-[10px] text-gray-500 uppercase">
                      Fulfilled via {p.source}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Stock Status */}
              <tr className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-700 bg-gray-50/80">Availability</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.stock_quantity > 0 ? (
                      <span className="text-emerald-700 font-bold">✓ Available in Stock</span>
                    ) : (
                      <span className="text-red-600 font-bold">Out of stock</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Dynamic Specs Rows */}
              {allSpecKeys.map((key) => (
                <tr key={key} className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-700 bg-gray-50/80">{key}</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-gray-800">
                      {p.specifications && p.specifications[key] ? (
                        p.specifications[key]
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AffiliateRedirectModal
        product={selectedAffiliateProduct}
        onClose={() => setSelectedAffiliateProduct(null)}
      />
    </div>
  );
}

