-- Migration: 20261106000001_marketplace_upgrade.sql
-- Description: Adds multi-marketplace source tracking, coupons engine, shipments (Shiprocket), and payment logs (Cashfree)

-- 1. Extend products table with provider/marketplace metadata
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'shopsphere',
  ADD COLUMN IF NOT EXISTS seller_name text DEFAULT 'ShopSphere Retail',
  ADD COLUMN IF NOT EXISTS affiliate_url text,
  ADD COLUMN IF NOT EXISTS original_price numeric(10,2);

CREATE INDEX IF NOT EXISTS idx_products_source ON public.products(source);

-- 2. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric(10, 2) NOT NULL,
  min_order_amount numeric(10, 2) DEFAULT 0,
  max_discount numeric(10, 2),
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- Seed default coupons for ₹0 Learning Mode
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount, max_discount, is_active)
VALUES
  ('LEARN10', 'percentage', 10, 500, 1000, true),
  ('SPHERE500', 'fixed', 500, 2000, NULL, true),
  ('WELCOME100', 'fixed', 100, 300, NULL, true)
ON CONFLICT (code) DO NOTHING;

-- 3. Extend orders table with Cashfree & Coupon fields
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS cashfree_order_id text,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS discount_amount numeric(10, 2) DEFAULT 0;

-- 4. Shipments Table (Shiprocket Logistics)
CREATE TABLE IF NOT EXISTS public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  awb_code text NOT NULL UNIQUE,
  courier_name text NOT NULL,
  status text NOT NULL DEFAULT 'manifested',
  destination_pincode text NOT NULL,
  estimated_delivery text,
  tracking_events jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_awb_code ON public.shipments(awb_code);

-- 5. Payments Table (Cashfree / UPI / COD)
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  amount numeric(10, 2) NOT NULL,
  cf_order_id text,
  cf_payment_id text,
  raw_webhook_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_cf_order_id ON public.payments(cf_order_id);

-- Enable RLS for newly created tables
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Coupons are readable by authenticated & anon users, writable only by admins
CREATE POLICY "Coupons are publicly readable" ON public.coupons
  FOR SELECT USING (true);

-- Shipments readable by order owner or admin
CREATE POLICY "Users view own shipments" ON public.shipments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = shipments.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Payments readable by order owner or admin
CREATE POLICY "Users view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payments.order_id
      AND orders.user_id = auth.uid()
    )
  );

