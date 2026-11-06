# COMPLETE MASTER PROMPT — AMAZON CLONE E-COMMERCE WEBSITE

Act as a senior full-stack software engineer, UI/UX designer, database architect, security engineer, and technical mentor.

Build a complete, production-style, full-stack Amazon-inspired e-commerce website from scratch. The project must be fully functional, responsive, interactive, and connected to a real backend and database.

Project name: ShopSphere
Project type: Full-Stack E-Commerce Web Application
Brand identity: Original ShopSphere branding inspired by Amazon's shopping experience.
Currency: Indian Rupees (₹)
Target: Professional portfolio project

IMPORTANT: Do not stop after creating a plan or static UI. Implement the complete project, including frontend, backend, database, authentication, shopping cart, checkout, orders, admin dashboard, testing, and deployment preparation.

==================================================
1. TECHNOLOGY STACK
==================================================

Frontend:
- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React icons

Backend:
- Next.js Server Actions
- Next.js API routes
- Supabase PostgreSQL

Authentication:
- Supabase Auth
- Email and password authentication
- Session management
- Role-based authorization

Storage:
- Supabase Storage for product images when necessary

Payments:
- Stripe Checkout in test mode
- Cash on Delivery as a demo option
- Secure webhook verification

Deployment:
- GitHub
- Vercel
- Supabase

Use stable, compatible package versions. Check the existing environment before installing anything or overwriting files.

==================================================
2. DESIGN AND UI/UX
==================================================

Create a premium, modern, polished e-commerce experience inspired by Amazon's usability, but with original ShopSphere branding.

Color palette:
- Primary dark: #131921
- Secondary dark: #232F3E
- Accent orange: #FF9900
- Background: #F5F6F7
- White surface: #FFFFFF
- Primary text: #111827
- Secondary text: #6B7280
- Success: #067D62
- Error: #B12704

Design requirements:
- Clean and professional layout
- Modern typography using Inter or a similar font
- Consistent spacing
- Rounded cards
- Subtle shadows and borders
- Smooth but lightweight animations
- Clear visual hierarchy
- Attractive product images
- Professional hover states
- Accessible buttons and forms
- Loading skeletons
- Toast notifications
- Empty states
- Error states
- Confirmation dialogs

Avoid clutter, broken layouts, unnecessary animations, and generic AI-generated designs.

==================================================
3. RESPONSIVE GLOBAL NAVIGATION
==================================================

Create a complete responsive navigation system.

Main navbar:
- ShopSphere logo
- Deliver-to location selector
- Large product search bar
- Search category selector
- Search submit button
- Account and sign-in dropdown
- Returns and Orders link
- Shopping cart icon
- Dynamic cart quantity badge

Secondary navbar:
- All categories menu
- Today's Deals
- Best Sellers
- New Arrivals
- Electronics
- Fashion
- Home & Kitchen
- Books
- Sports

Mobile:
- Responsive header
- Accessible mobile menu
- Mobile search bar
- Collapsible navigation
- Touch-friendly buttons
- Responsive product grids

Create a professional footer with:
- About ShopSphere
- Contact
- Customer service
- FAQs
- Privacy policy
- Terms and conditions
- Returns and refunds
- Social media links

==================================================
4. HOMEPAGE
==================================================

Route: /

Build an attractive, fully functional homepage with:

1. Promotional hero carousel
2. Shop by category
3. Today's deals
4. Best sellers
5. Recommended products
6. Electronics section
7. Fashion section
8. Home and kitchen products
9. Books and accessories
10. Recently viewed products
11. Featured brands
12. Newsletter subscription UI
13. Footer

Use real, attractive product images from reliable image sources.

Create reusable components:
- Navbar
- Footer
- ProductCard
- ProductGrid
- CategoryCard
- HeroCarousel
- DealCard
- RatingStars
- PriceDisplay
- DiscountBadge
- SearchBar
- LoadingSkeleton
- EmptyState

==================================================
5. PRODUCT CATALOG
==================================================

Route: /products

Implement:
- Product listing
- Responsive product grid
- Product pagination
- Search
- Category filtering
- Brand filtering
- Price range filtering
- Rating filtering
- Stock availability filtering
- Sort by popularity
- Sort by price ascending
- Sort by price descending
- Sort by newest
- Sort by rating

Product fields:
- ID
- Name
- Slug
- Description
- Brand
- Category
- Price
- Discount price
- Image URLs
- Stock quantity
- Average rating
- Review count
- Specifications
- Created date
- Updated date

==================================================
6. PRODUCT DETAILS
==================================================

Route: /products/[slug]

Display:
- Product image gallery
- Product name
- Brand
- Rating
- Review count
- Original price
- Discounted price
- Discount percentage
- Stock status
- Quantity selector
- Add to Cart button
- Buy Now button
- Delivery estimate
- Product description
- Specifications
- Customer reviews
- Related products

Implement:
- Interactive image gallery
- Image zoom where appropriate
- Quantity validation
- Stock validation
- Add-to-cart functionality
- Wishlist toggle
- Related products
- Responsive layout

==================================================
7. SEARCH FUNCTIONALITY
==================================================

Route: /search?q=keyword

Implement a functional search engine that searches:
- Product name
- Brand
- Category
- Description

Features:
- Search suggestions
- Search autocomplete
- Recent searches
- Clear search
- Search results page
- Search filters
- Sorting
- Empty search results state

Search must query the database instead of relying on static frontend arrays.

==================================================
8. AUTHENTICATION
==================================================

Use Supabase Authentication.

Routes:
- /login
- /register
- /forgot-password
- /reset-password
- /account

Features:
- Register with email and password
- Login
- Logout
- Password reset
- Email verification where supported
- Session persistence
- Profile management
- Protected routes
- Authenticated user navigation

Validation:
- Valid email
- Password strength
- Confirm password
- Helpful validation messages
- Error handling

Security:
- Never expose secret keys
- Never store plain-text passwords
- Use secure session handling
- Protect account information

==================================================
9. SHOPPING CART
==================================================

Route: /cart

Features:
- Add items to cart
- Remove items
- Increase quantity
- Decrease quantity
- Show product image
- Show product price
- Show quantity
- Show subtotal
- Calculate discounts
- Calculate delivery charges
- Calculate total
- Continue shopping
- Proceed to checkout

Requirements:
- Guest cart using local storage
- Authenticated cart persistence in Supabase
- Merge guest cart after login
- Validate inventory
- Validate product prices on the server
- Prevent purchasing unavailable products
- Update cart count instantly
- Persist cart after refresh

Never trust frontend-calculated prices.

==================================================
10. WISHLIST
==================================================

Route: /wishlist

Features:
- Add products to wishlist
- Remove products
- View wishlist
- Move products to cart
- Persistent wishlist for authenticated users
- Guest wishlist support where appropriate
- Login prompt for permanent synchronization

==================================================
11. CHECKOUT
==================================================

Route: /checkout

Implement a multi-step checkout experience.

Step 1: Delivery address
- Full name
- Phone number
- Address
- City
- State
- Postal code
- Country
- Saved addresses
- Add new address

Step 2: Delivery options
- Standard delivery
- Estimated delivery date
- Delivery charges

Step 3: Order summary
- Products
- Quantity
- Price
- Subtotal
- Discount
- Delivery charges
- Final total

Step 4: Payment method
- Stripe Checkout test mode
- Cash on Delivery demo option

Step 5: Place order
- Validate stock
- Calculate final price on the server
- Create order securely
- Reduce inventory safely
- Show confirmation

Never collect, store, or expose raw card details or CVV.

==================================================
12. PAYMENT INTEGRATION
==================================================

Integrate Stripe Checkout in test mode.

Requirements:
- Secure server-side checkout session creation
- Test environment variables
- Stripe test cards
- Payment success page
- Payment failure handling
- Payment cancellation handling
- Webhook verification
- Secure order status updates
- Prevent duplicate order processing
- Verify payment amount and order ID

Never use live payment credentials.

If Stripe configuration is unavailable, implement a clear setup guide and maintain a working Cash on Delivery demo flow.

==================================================
13. ORDER MANAGEMENT
==================================================

Routes:
- /orders
- /orders/[id]

Features:
- Order history
- Order details
- Order date
- Order number
- Purchased products
- Quantity
- Price
- Total amount
- Delivery address
- Payment method
- Payment status
- Order status
- Order tracking timeline
- Cancel order when eligible

Order statuses:
- Pending
- Confirmed
- Processing
- Shipped
- Out for delivery
- Delivered
- Cancelled

Users must only access their own orders.

==================================================
14. USER ACCOUNT
==================================================

Route: /account

Sections:
- Profile details
- Edit name
- Edit phone
- Saved addresses
- Default address
- Order history
- Wishlist
- Account security
- Logout

Make the account dashboard clean and professional.

==================================================
15. ADMIN DASHBOARD
==================================================

Route: /admin

Create a fully functional and secure admin dashboard.

Dashboard metrics:
- Total revenue
- Total orders
- Total customers
- Total products
- Pending orders
- Low-stock products
- Recent orders
- Sales charts

Product management:
- Create product
- Edit product
- Delete product
- Upload product images
- Set prices
- Set discounts
- Manage inventory
- Assign categories
- Activate or deactivate products

Category management:
- Create categories
- Edit categories
- Delete categories
- Assign category images

Order management:
- View orders
- Search orders
- Filter orders
- View order details
- Update order status
- Update payment status

Customer management:
- View customer list
- View customer order history
- Search customers

Security:
- Admin-only access
- Server-side role verification
- Unauthorized users must receive an appropriate error or redirect
- Never rely only on hiding admin UI in the frontend

==================================================
16. DATABASE ARCHITECTURE
==================================================

Use Supabase PostgreSQL.

Create tables with proper UUIDs, relationships, indexes, timestamps, constraints, and migrations.

Table: profiles
- id UUID referencing auth.users
- full_name
- phone
- role (customer or admin)
- created_at
- updated_at

Table: categories
- id
- name
- slug
- description
- image_url
- created_at

Table: products
- id
- name
- slug
- description
- brand
- category_id
- price
- discount_price
- stock_quantity
- image_urls
- specifications JSONB
- is_active
- created_at
- updated_at

Table: reviews
- id
- product_id
- user_id
- rating
- comment
- created_at

Table: addresses
- id
- user_id
- full_name
- phone
- address_line_1
- address_line_2
- city
- state
- postal_code
- country
- is_default
- created_at

Table: cart_items
- id
- user_id
- product_id
- quantity
- created_at
- updated_at

Table: wishlists
- id
- user_id
- product_id
- created_at

Table: orders
- id
- user_id
- total_amount
- shipping_address JSONB
- payment_method
- payment_status
- order_status
- stripe_session_id
- created_at
- updated_at

Table: order_items
- id
- order_id
- product_id
- product_name
- product_image
- unit_price
- quantity
- subtotal

Add appropriate constraints, relationships, and indexes.

Create SQL migrations and seed scripts.

==================================================
17. SECURITY
==================================================

Implement:
- Supabase Row Level Security
- Secure RLS policies
- Server-side input validation
- Zod validation schemas
- Role-based access control
- Protected API routes
- Secure environment variables
- Safe error handling
- Server-side price calculations
- Inventory validation
- Secure payment verification
- Prevention of unauthorized data access
- Protection against SQL injection
- Protection against duplicate checkout requests

Never:
- Expose service-role keys in client code
- Commit .env files
- Trust frontend payment totals
- Allow customers to modify order prices
- Allow users to read other users' data
- Allow unauthorized admin operations

==================================================
18. DEMO DATA
==================================================

Seed the database with at least 40 realistic sample products.

Categories:
- Electronics
- Smartphones
- Computers
- Fashion
- Home and kitchen
- Books
- Sports
- Beauty
- Accessories

Every sample product should contain:
- Product name
- Brand
- Description
- Product image
- Price in INR
- Discount price where applicable
- Rating
- Stock quantity
- Category

Ensure the product images actually load.

Use INR formatting:
₹1,499
₹12,999
₹49,999

==================================================
19. PROJECT STRUCTURE
==================================================

Maintain a clean, scalable folder structure similar to:

shopsphere/
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── search/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── register/
│   │   ├── account/
│   │   ├── orders/
│   │   ├── wishlist/
│   │   └── admin/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── admin/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── validations/
│   │   ├── utils.ts
│   │   └── helpers/
│   ├── hooks/
│   ├── actions/
│   ├── types/
│   └── config/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.example
├── README.md
├── package.json
└── tsconfig.json

Adapt the structure when necessary, but maintain separation of concerns and reusable components.

==================================================
20. PERFORMANCE AND ACCESSIBILITY
==================================================

Performance:
- Use Next.js Image
- Optimize image loading
- Lazy-load noncritical components
- Avoid unnecessary re-renders
- Use efficient database queries
- Add pagination
- Use loading skeletons
- Minimize dependencies
- Avoid large client-side bundles

Accessibility:
- Semantic HTML
- Keyboard navigation
- Accessible form labels
- Alt text for images
- Proper color contrast
- Visible focus indicators
- Screen-reader-friendly controls
- Accessible dialogs and menus
- Responsive design

==================================================
21. TESTING AND QUALITY ASSURANCE
==================================================

Test the complete application.

Verify:
- Homepage loads correctly
- Navigation works
- Search returns relevant results
- Filters work
- Sorting works
- Product detail pages work
- Product images load
- Cart functionality works
- Cart persists after refresh
- Wishlist works
- Authentication works
- Password reset works
- User profiles work
- Checkout validation works
- Orders are created correctly
- Inventory updates correctly
- Stripe test payment works
- Webhooks work
- Admin dashboard is protected
- Product CRUD works
- Order management works
- Mobile responsiveness works
- Error states work
- No broken routes
- No console errors
- No TypeScript errors
- No exposed secrets

Fix discovered bugs before proceeding.

==================================================
22. ENVIRONMENT VARIABLES
==================================================

Create a .env.example file containing placeholders for:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=

Explain how to configure these variables.

Do not create fake credentials.

Do not commit actual .env files to GitHub.

==================================================
23. README AND DEPLOYMENT
==================================================

Create a professional README.md including:

- Project overview
- Features
- Technology stack
- Screenshots section
- Installation instructions
- Local development instructions
- Supabase configuration
- Database migration instructions
- Seed data instructions
- Authentication configuration
- Stripe test configuration
- Environment variables
- Admin setup instructions
- Testing instructions
- GitHub instructions
- Vercel deployment guide
- Known limitations

Prepare the project for deployment on Vercel.

Verify the production build before declaring the project ready.

==================================================
24. IMPLEMENTATION INSTRUCTIONS
==================================================

I am a beginner developer using a MacBook Air M2.

Follow these rules:

1. First inspect my existing environment and workspace.
2. If an existing project is present, inspect it before modifying anything.
3. Explain necessary terminal commands in simple language.
4. Create the project and install dependencies.
5. Build the complete project feature by feature.
6. Do not stop after generating a plan.
7. Do not ask me to manually write code that you can implement yourself.
8. If external credentials are needed, continue with all possible work and clearly explain the exact setup needed.
9. Do not expose or invent credentials.
10. Do not overwrite existing files without checking.
11. Run the application and test the implementation.
12. Fix errors before marking features complete.
13. Use real Supabase data instead of permanent hardcoded mock data.
14. Ensure every important button and navigation element works.
15. Maintain a professional UI throughout.
16. Explain complex technical concepts in simple beginner-friendly English.
17. Keep track of completed features and remaining tasks.
18. Do not claim deployment, payment, or authentication is complete unless it has actually been verified.

==================================================
25. FINAL OBJECTIVE
==================================================

Deliver a complete, working ShopSphere full-stack e-commerce application that includes:

- Professional Amazon-inspired homepage
- Responsive navigation
- Product catalog
- Product details
- Search and filtering
- Authentication
- Shopping cart
- Wishlist
- Checkout
- Stripe test payments
- Cash on Delivery demo
- Order history
- Order tracking
- User account
- Admin dashboard
- Product management
- Inventory management
- Order management
- Supabase database
- Database security
- Demo products
- Testing
- Documentation
- GitHub-ready source code
- Vercel deployment readiness

Start now.

First inspect the environment, create the project foundation, and then continue implementing the entire application. Do not stop at the planning stage. Work autonomously wherever possible, ask me only when genuinely necessary, and report any external setup requirements clearly.

The final result must be a real functional application, not just a visual prototype.
