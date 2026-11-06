export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  subcategories?: string[];
  created_at?: string;
}

export type ProductSource = 'shopsphere' | 'amazon' | 'flipkart' | 'ebay';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category_id?: string | null;
  category?: Category | null;
  price: number;
  discount_price?: number | null;
  stock_quantity: number;
  image_urls: string[];
  specifications?: Record<string, string>;
  is_active: boolean;
  rating?: number;
  review_count?: number;
  source: ProductSource;
  seller_name?: string;
  affiliate_url?: string;
  external_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  product: Product;
  created_at?: string;
}

export interface Address {
  id?: string;
  user_id?: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'cashfree' | 'cod' | 'stripe';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string | null;
  product_name: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  awb_code: string;
  courier_name: string;
  current_status: string;
  estimated_delivery: string;
  tracking_events: TrackingEvent[];
}

export interface Coupon {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number;
  is_active: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  subtotal_amount?: number;
  discount_amount?: number;
  coupon_code?: string | null;
  shipping_address: Address;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  stripe_session_id?: string | null;
  cashfree_order_id?: string | null;
  shipment?: Shipment | null;
  created_at: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string | null;
  phone: string | null;
  role: 'customer' | 'admin';
}

export interface ProviderHealth {
  id: ProductSource | 'cashfree' | 'shiprocket';
  name: string;
  type: 'marketplace' | 'payment' | 'shipping';
  mode: 'simulated' | 'live' | 'external_link';
  is_configured: boolean;
  status_message: string;
  docs_url: string;
  required_env_vars: string[];
}

export interface ProductFilterParams {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  source?: ProductSource;
  page?: number;
  limit?: number;
}
