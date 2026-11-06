-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text check (role in ('customer', 'admin')) default 'customer',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Categories Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz default now()
);

-- 3. Products Table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  brand text not null,
  category_id uuid references public.categories(id) on delete set null,
  price numeric not null check (price >= 0),
  discount_price numeric check (discount_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  image_urls text[] not null default '{}',
  specifications jsonb default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Reviews Table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamptz default now()
);

-- 5. Addresses Table
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean default false,
  created_at timestamptz default now()
);

-- 6. Cart Items Table
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, product_id)
);

-- 7. Wishlists Table
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- 8. Orders Table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  total_amount numeric not null check (total_amount >= 0),
  shipping_address jsonb not null,
  payment_method text not null check (payment_method in ('stripe', 'cod')),
  payment_status text not null check (payment_status in ('pending', 'paid', 'failed', 'refunded')) default 'pending',
  order_status text not null check (order_status in ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')) default 'pending',
  stripe_session_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. Order Items Table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  unit_price numeric not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  subtotal numeric not null check (subtotal >= 0)
);

-- Indexes for performance
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_brand on public.products(brand);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_cart_user on public.cart_items(user_id);
create index if not exists idx_wishlist_user on public.wishlists(user_id);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Profiles Policies
create policy "Users can view own profile or admins can view all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Categories Policies (Public readable, admin writable)
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

create policy "Admins can insert categories"
  on public.categories for insert
  with check (public.is_admin());

create policy "Admins can update categories"
  on public.categories for update
  using (public.is_admin());

create policy "Admins can delete categories"
  on public.categories for delete
  using (public.is_admin());

-- Products Policies (Public readable, admin writable)
create policy "Active products are viewable by everyone"
  on public.products for select
  using (is_active = true or public.is_admin());

create policy "Admins can insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "Admins can update products"
  on public.products for update
  using (public.is_admin());

create policy "Admins can delete products"
  on public.products for delete
  using (public.is_admin());

-- Reviews Policies (Public readable, auth users can create)
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete own reviews or admin"
  on public.reviews for delete
  using (auth.uid() = user_id or public.is_admin());

-- Addresses Policies
create policy "Users can view own addresses"
  on public.addresses for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can create own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- Cart Items Policies
create policy "Users can view own cart items"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert into own cart"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cart items"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete own cart items"
  on public.cart_items for delete
  using (auth.uid() = user_id);

-- Wishlist Policies
create policy "Users can view own wishlist"
  on public.wishlists for select
  using (auth.uid() = user_id);

create policy "Users can add to own wishlist"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from own wishlist"
  on public.wishlists for delete
  using (auth.uid() = user_id);

-- Orders Policies
create policy "Users can view own orders or admin all"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users or admin can update orders"
  on public.orders for update
  using (auth.uid() = user_id or public.is_admin());

-- Order Items Policies
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Users can insert order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Profile creation trigger on auth.users insert
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

