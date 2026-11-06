# ShopSphere — Amazon-Inspired Multi-Marketplace & E-Commerce Platform

**ShopSphere** is a production-style, full-stack multi-marketplace e-commerce web application inspired by Amazon's iconic shopping experience, customized with original ShopSphere branding, multi-provider marketplace discovery, and Indian Rupee (₹) currency formatting.

---

## 🎓 ₹0 Learning / Demo Mode

ShopSphere is built with a **100% Zero-Cost Learning Architecture**:
- **Zero Paid Subscriptions / APIs Required**: Runs completely out of the box without requiring paid keys from Amazon, Flipkart, eBay, Cashfree, or Shiprocket.
- **Marketplace search without API keys**: Search results show direct links to Amazon India, Flipkart, and eBay. Those links open the marketplaces’ own live search pages. ShopSphere does not scrape them or pretend their listings are imported.
- **Interactive Cashfree Gateway Simulator**: Experience real payment state transitions (Success, Failure, and Pending dropped sessions) with webhook callbacks and idempotency without touching real money.
- **Shiprocket Logistics Simulation**: Complete PIN code serviceability engine, courier selection (BlueDart, Delhivery, Shadowfax, DTDC), automated Air Waybill (AWB) generation, and multi-stage tracking timelines.
- **Honest provider status**: Search-link access is labelled separately from a connected official API. Marketplace prices, images, ratings, seller names, and stock are shown inside ShopSphere only when returned by an authorized API.

---

## 🌟 Key Features

### 1. Multi-Marketplace Discovery & Affiliate Separation
- **Source Badges**: ShopSphere catalogue items are labelled as ShopSphere Direct. Amazon, Flipkart, and eBay are provided as external search destinations until official product APIs are configured.
- **External marketplace separation**: External marketplace search links open the original marketplace site; they are not represented as ShopSphere inventory or checkout items.
- **Side-by-Side Product Comparison**: Compare specifications, ratings, prices, and warranties side-by-side at `/compare`.
- **Search Autocomplete & History**: Live search suggestions across departments with stored recent search history in `localStorage`.

### 2. Payments & Logistics Engine
- **Cashfree Payments (India)**:
  - Server-side order generation and payment session IDs.
  - Interactive simulator (`/checkout/payment-simulate`) for testing Success, Failure, and User Abort flows.
  - Signed webhook signature verification endpoint (`/api/webhooks/cashfree`).
  - Cash on Delivery (COD) demo option.
- **Shiprocket Logistics**:
  - Live PIN code serviceability check across Indian pin codes.
  - Automated courier selection based on rate and estimated transit days.
  - AWB tracking generation with timestamped tracking milestones (*Manifested → In Transit → Out for Delivery → Delivered*).
- **Coupon Engine**:
  - Interactive promo codes applied in checkout (`LEARN10`, `SPHERE500`, `WELCOME100`).
  - Validation for minimum order limits and maximum discounts.
  - Dynamic admin coupon manager to create, toggle, and retire promos.

### 3. Shopping Experience & Catalog
- **Amazon-style Global Header**: ShopSphere logo, deliver-to postal code modal, search bar with departmental dropdown, account dropdown with role switcher, returns & orders, dynamic cart badge.
- **Secondary Navigation Bar**: Quick category links (Today's Deals, Best Sellers, Electronics, Smartphones, Computers, Fashion, Home & Kitchen, Books, Sports) and mobile category drawer.
- **Comprehensive Footer**: Back-to-top button, company information, legal disclosures, and currency selector.
- **Interactive Image Gallery**: Main display with thumbnail selector and hover zoom.
- **Buy Box**: Real-time stock status, quantity picker, "Add to Cart", instant "Buy Now" checkout, and wishlist toggle.
- **Customer Reviews**: Star rating breakdown and verified customer testimonials.

### 4. Admin Portal (Seller Central)
- **Metrics Dashboard**: Gross revenue, order volume, catalog size, and low-stock alerts.
- **Catalog Management**: Full CRUD interface to inspect products, prices, and inventory.
- **Order Management**: Inspect orders, view payment methods, tracking numbers, and delivery statuses.
- **Coupon Engine**: Create new promotional vouchers and toggle active status.
- **Provider Status & Health**: Real-time monitoring of all 5 provider adapters (ShopSphere, Amazon, Flipkart, eBay, Shiprocket, Cashfree).
- **Payment & Webhook Logs**: Audit trail of simulated and live payment events.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React icons
- **Backend**: Next.js Route Handlers, Server Actions, Supabase PostgreSQL
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth
- **Payments**: Cashfree Payments (Sandbox + Simulator) + Cash on Delivery
- **Shipping**: Shiprocket Logistics (API + Simulator)
- **Styling**: Tailored Amazon color palette (`#131921`, `#232F3E`, `#FF9900`, `#FEBD69`, `#F5F6F7`)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm** or **pnpm**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/shopsphere.git
cd shopsphere

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience ShopSphere.

---

## 📁 Database Migrations (Supabase)

If using a live Supabase project:
1. `supabase/migrations/20261106000000_init_schema.sql` — Core schema for users, products, categories, cart, wishlist, orders.
2. `supabase/migrations/20261106000001_marketplace_upgrade.sql` — Extended tables for coupons, shipments (Shiprocket), payments (Cashfree), and multi-marketplace metadata.


## Marketplace search without API credentials

ShopSphere can provide direct search links to Amazon India, Flipkart, and eBay without requiring API credentials. When a marketplace API is not configured, the search page displays a clearly labelled **Search link** for that marketplace and opens its own website in a new tab. It does not invent marketplace product cards, prices, ratings, sellers, stock, or images.

To show marketplace listings inside ShopSphere, configure an approved official provider API using the environment variables listed in `.env.example`. Direct search links are not affiliate links and do not import product data.
