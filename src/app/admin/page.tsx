'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Shield,
  Search,
  Tag,
  Radio,
  FileText,
  Truck,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/data/mock-data';
import { Product, Order, OrderStatus, Coupon, ProviderHealth } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { ProviderRegistry } from '@/lib/providers/provider-registry';
import { INITIAL_COUPONS } from '@/lib/coupons/coupon-service';

export default function AdminDashboardPage() {
  const { user, switchRole } = useAuth();

  // Tabs: 'metrics' | 'products' | 'orders' | 'coupons' | 'providers' | 'webhooks'
  const [activeTab, setActiveTab] = useState<'metrics' | 'products' | 'orders' | 'coupons' | 'providers' | 'webhooks'>('metrics');

  // Products state (can create / delete / edit)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [productSearch, setProductSearch] = useState('');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 10,
    min_order_amount: 500,
    max_discount: 1000,
  });

  // Providers Health state
  const [providersHealth, setProvidersHealth] = useState<ProviderHealth[]>([]);

  // Modal for new product
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category_id: INITIAL_CATEGORIES[0].id,
    price: 999,
    discount_price: 799,
    stock_quantity: 50,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    source: 'shopsphere' as const,
  });

  useEffect(() => {
    // Load Provider Health
    const registry = ProviderRegistry.getInstance();
    setProvidersHealth(registry.getProvidersHealth());

    // Load Orders
    try {
      const stored = localStorage.getItem('shopsphere_user_orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        const seedOrders: Order[] = [
          {
            id: 'ORD-2026-98124',
            user_id: 'usr-1',
            total_amount: 24990,
            shipping_address: {
              full_name: 'Rahul Sharma',
              phone: '+91 98765 43210',
              address_line_1: 'Flat 402, Sea Green Apartments',
              city: 'Mumbai',
              state: 'Maharashtra',
              postal_code: '400050',
              country: 'India',
            },
            payment_method: 'cashfree',
            payment_status: 'paid',
            order_status: 'delivered',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            order_items: [
              {
                product_name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
                unit_price: 24990,
                quantity: 1,
                subtotal: 24990,
              },
            ],
          },
          {
            id: 'ORD-2026-98125',
            user_id: 'usr-2',
            total_amount: 148900,
            shipping_address: {
              full_name: 'Priya Patel',
              phone: '+91 99887 76655',
              address_line_1: '12 Prestige Garden, Koramangala',
              city: 'Bengaluru',
              state: 'Karnataka',
              postal_code: '560034',
              country: 'India',
            },
            payment_method: 'cod',
            payment_status: 'pending',
            order_status: 'processing',
            created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            order_items: [
              {
                product_name: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
                unit_price: 148900,
                quantity: 1,
                subtotal: 148900,
              },
            ],
          },
        ];
        setOrders(seedOrders);
        localStorage.setItem('shopsphere_user_orders', JSON.stringify(seedOrders));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.order_status === 'pending' || o.order_status === 'processing').length;
  const lowStockProducts = products.filter((p) => p.stock_quantity < 20).length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `p-${Date.now()}`,
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      brand: newProduct.brand,
      category_id: newProduct.category_id,
      price: Number(newProduct.price),
      discount_price: Number(newProduct.discount_price),
      stock_quantity: Number(newProduct.stock_quantity),
      description: newProduct.description,
      image_urls: [newProduct.image_url],
      is_active: true,
      rating: 5.0,
      review_count: 1,
      source: 'shopsphere',
      seller_name: 'ShopSphere Direct Retail',
      created_at: new Date().toISOString(),
    };

    setProducts([created, ...products]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      brand: '',
      category_id: INITIAL_CATEGORIES[0].id,
      price: 999,
      discount_price: 799,
      stock_quantity: 50,
      description: '',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      source: 'shopsphere',
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o));
    setOrders(updated);
    try {
      localStorage.setItem('shopsphere_user_orders', JSON.stringify(updated));
    } catch {}
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon: Coupon = {
      code: newCoupon.code.trim().toUpperCase(),
      description: newCoupon.description,
      discount_type: newCoupon.discount_type,
      discount_value: Number(newCoupon.discount_value),
      min_order_amount: Number(newCoupon.min_order_amount),
      max_discount: Number(newCoupon.max_discount),
      is_active: true,
    };
    setCoupons([coupon, ...coupons]);
    setShowAddCouponModal(false);
    setNewCoupon({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_amount: 500,
      max_discount: 1000,
    });
  };

  const handleToggleCoupon = (code: string) => {
    setCoupons(coupons.map((c) => (c.code === code ? { ...c, is_active: !c.is_active } : c)));
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders =
    orderFilter === 'all'
      ? orders
      : orders.filter((o) => o.order_status === orderFilter);

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-8 space-y-6">
      {/* Top Banner & Demo Role Warning */}
      <div className="bg-amazon-dark text-white rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amazon-orange rounded-lg text-gray-950 font-black">
            <Shield size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">ShopSphere Seller Central</h1>
              <span className="text-[10px] bg-amber-400 text-gray-950 font-black px-2 py-0.5 rounded uppercase">
                ₹0 Learning Mode
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Store metrics, multi-marketplace health, catalog CRUD, coupon manager and webhook logs
            </p>
          </div>
        </div>

        {/* Demo Mode Role Switcher */}
        <div className="flex items-center gap-3 bg-amazon-light_dark px-4 py-2 rounded-lg border border-gray-700 text-xs">
          <span className="text-gray-300">Logged in as:</span>
          <span className="font-bold uppercase text-amazon-yellow">
            {user?.role || 'customer'}
          </span>
          {user?.role !== 'admin' && (
            <button
              onClick={() => switchRole('admin')}
              className="ml-2 px-3 py-1 bg-amazon-orange hover:bg-amazon-orange_hover text-gray-950 font-bold rounded text-xs transition-colors"
            >
              Enable Admin Mode
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-300 text-xs font-bold gap-6 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 transition-colors ${
            activeTab === 'metrics'
              ? 'border-b-2 border-amazon-orange text-amazon-hover'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors ${
            activeTab === 'products'
              ? 'border-b-2 border-amazon-orange text-amazon-hover'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Catalog Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors ${
            activeTab === 'orders'
              ? 'border-b-2 border-amazon-orange text-amazon-hover'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 transition-colors ${
            activeTab === 'coupons'
              ? 'border-b-2 border-amazon-orange text-amazon-hover'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Coupon Engine ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeTab === 'providers'
              ? 'border-b-2 border-amazon-orange text-amazon-hover'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Radio size={14} className="text-amber-500" />
          Marketplace & API Providers ({providersHealth.length})
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`pb-3 transition-colors ${
            activeTab === 'webhooks'
              ? 'border-b-2 border-amazon-orange text-amazon-hover'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Webhook & Payment Logs
        </button>
      </div>

      {/* TAB 1: METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                <span>TOTAL REVENUE</span>
                <TrendingUp size={18} className="text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-gray-900">
                {formatPrice(totalRevenue)}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                +18.4% from last month
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                <span>TOTAL ORDERS</span>
                <ShoppingBag size={18} className="text-amazon-orange" />
              </div>
              <div className="text-2xl font-black text-gray-900">{totalOrders}</div>
              <div className="text-[11px] text-gray-500 mt-1">
                {pendingOrders} awaiting fulfillment
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                <span>TOTAL PRODUCTS</span>
                <Package size={18} className="text-blue-600" />
              </div>
              <div className="text-2xl font-black text-gray-900">{products.length}</div>
              <div className="text-[11px] text-gray-500 mt-1">ShopSphere + Multi-Marketplace</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                <span>LOW STOCK ALERTS</span>
                <AlertTriangle size={18} className="text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">{lowStockProducts}</div>
              <div className="text-[11px] text-amber-700 mt-1">Products under 20 units</div>
            </div>
          </div>

          {/* Low Stock Watchlist */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <span>Low-Stock Inventory Watchlist</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {products
                .filter((p) => p.stock_quantity < 20)
                .slice(0, 4)
                .map((p) => (
                  <div key={p.id} className="p-3 border border-red-200 bg-red-50/30 rounded-lg">
                    <span className="font-bold text-gray-900 block truncate">{p.name}</span>
                    <span className="text-red-700 font-bold mt-1 block">
                      Only {p.stock_quantity} units remaining
                    </span>
                    <span className="text-[11px] text-gray-500 block">{p.brand}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search catalog products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded text-xs shadow-sm"
            >
              <Plus size={16} /> Add New ShopSphere Product
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Source / Seller</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3 flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-gray-100 rounded shrink-0 overflow-hidden">
                          {p.image_urls[0] && (
                            <Image
                              src={p.image_urls[0]}
                              alt={p.name}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          )}
                        </div>
                        <span className="font-semibold text-gray-900 max-w-xs truncate">
                          {p.name}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                          {p.source}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-900">{formatPrice(p.price)}</td>
                      <td className="p-3">
                        <span
                          className={`font-bold ${
                            p.stock_quantity < 20 ? 'text-red-600' : 'text-gray-800'
                          }`}
                        >
                          {p.stock_quantity} units
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto text-xs pb-1">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`px-3 py-1.5 rounded-full font-bold capitalize transition-colors ${
                    orderFilter === status
                      ? 'bg-amazon-orange text-gray-950'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Shipment AWB</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Advance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{o.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-gray-800">
                          {o.shipping_address?.full_name}
                        </div>
                        <div className="text-gray-500 text-[10px]">
                          {o.shipping_address?.city}, PIN {o.shipping_address?.postal_code}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-blue-700">
                        {o.shipment?.awb_code || 'Auto-Generating'}
                      </td>
                      <td className="p-3 font-bold text-gray-900">
                        {formatPrice(o.total_amount)}
                      </td>
                      <td className="p-3">
                        <span className="uppercase font-semibold text-gray-700">
                          {o.payment_method}
                        </span>
                        <span className="text-[10px] text-emerald-700 block capitalize font-medium">
                          {o.payment_status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="capitalize font-bold text-xs text-amazon-hover">
                          {o.order_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={o.order_status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)
                          }
                          className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:border-amazon-orange cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COUPON MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-gray-900">Discount Coupons Engine</h2>
              <p className="text-xs text-gray-500">Configure promotional vouchers for checkout</p>
            </div>
            <button
              onClick={() => setShowAddCouponModal(true)}
              className="px-4 py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={16} /> Create Promo Code
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.code} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 text-xs shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="font-mono font-black text-sm text-amazon-hover bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {c.code}
                  </span>
                  <button
                    onClick={() => handleToggleCoupon(c.code)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.is_active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {c.is_active ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
                <p className="text-gray-700 font-medium">{c.description}</p>
                <div className="pt-2 border-t border-gray-100 text-gray-500 space-y-1 text-[11px]">
                  <div>Type: {c.discount_type === 'percentage' ? `${c.discount_value}% Off` : `₹${c.discount_value} Flat`}</div>
                  <div>Min Order Amount: ₹{c.min_order_amount}</div>
                  {c.max_discount && <div>Max Cap: ₹{c.max_discount}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PROVIDERS HEALTH & INTEGRATION STATUS */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Marketplace & Service Providers</h2>
            <p className="text-xs text-gray-500">
              Live status and production environment variables readiness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {providersHealth.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">{p.name}</h3>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      Type: {p.type}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                      p.mode === 'live'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.mode === 'external_link'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {p.mode.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded text-[11px] text-gray-700">
                  {p.status_message}
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                    Environment Keys:
                  </span>
                  <div className="space-y-1">
                    {p.required_env_vars.map((v) => (
                      <div key={v} className="font-mono text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded truncate">
                        {v}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <a
                    href={p.docs_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amazon-blue hover:underline font-semibold flex items-center gap-1 text-[11px]"
                  >
                    View Official API Documentation <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: WEBHOOK & PAYMENT LOGS */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Payment & Webhook Inspection Log</h2>
            <p className="text-xs text-gray-500">Audit incoming events from Cashfree, Stripe, and Shiprocket</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Event Type</th>
                    <th className="p-3">Signature Verification</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{new Date().toLocaleTimeString()}</td>
                    <td className="p-3 font-bold text-purple-700">Cashfree PG</td>
                    <td className="p-3 font-mono text-[11px]">PAYMENT_SUCCESS_WEBHOOK</td>
                    <td className="p-3 font-semibold text-emerald-700">✓ HMAC-SHA256 Passed</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">PROCESSED (200 OK)</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{new Date(Date.now() - 3600000).toLocaleTimeString()}</td>
                    <td className="p-3 font-bold text-blue-700">Shiprocket</td>
                    <td className="p-3 font-mono text-[11px]">SHIPMENT_OUT_FOR_DELIVERY</td>
                    <td className="p-3 font-semibold text-emerald-700">✓ Token Authenticated</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">PROCESSED (200 OK)</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{new Date(Date.now() - 7200000).toLocaleTimeString()}</td>
                    <td className="p-3 font-bold text-gray-700">Stripe Test</td>
                    <td className="p-3 font-mono text-[11px]">checkout.session.completed</td>
                    <td className="p-3 font-semibold text-emerald-700">✓ Signed Webhook OK</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">PROCESSED (200 OK)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-lg max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Product Listing</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Department *</label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">M.R.P. Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Deal Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.discount_price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, discount_price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock_quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Image URL *</label>
                <input
                  type="url"
                  required
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Description *</label>
                <textarea
                  rows={3}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded text-xs"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Coupon Modal */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-lg max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Promo Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded uppercase font-mono focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% discount on festive sales"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount Type *</label>
                  <select
                    value={newCoupon.discount_type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discount_value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Min Order Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.min_order_amount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.max_discount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, max_discount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-amazon-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold rounded text-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
