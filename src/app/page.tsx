import React from 'react';
import Link from 'next/link';
import { HeroCarousel } from '@/components/layout/HeroCarousel';
import { CategoryCard } from '@/components/layout/CategoryCard';
import { ProductCard } from '@/components/products/ProductCard';
import { getCategories, getDeals, getBestSellers, getProducts } from '@/lib/data-service';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { ArrowRight, Zap, Trophy, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

export default async function HomePage() {
  const categories = await getCategories();
  const deals = await getDeals();
  const bestSellers = await getBestSellers();

  // Category specific slices
  const { products: electronics } = await getProducts({ category: 'electronics', limit: 4 });
  const { products: smartphones } = await getProducts({ category: 'smartphones', limit: 4 });
  const { products: computers } = await getProducts({ category: 'computers', limit: 4 });
  const { products: fashion } = await getProducts({ category: 'fashion', limit: 4 });
  const { products: homeKitchen } = await getProducts({ category: 'home-and-kitchen', limit: 4 });
  const { products: books } = await getProducts({ category: 'books', limit: 4 });

  return (
    <div className="pb-16">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      <div className="max-w-[1500px] mx-auto px-4 -mt-16 sm:-mt-24 md:-mt-36 relative z-20 space-y-8">
        {/* 2. Overlapping 4-Grid Featured Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.slice(0, 4).map((cat) => (
            <CategoryCard
              key={cat.id}
              title={`Explore ${cat.name}`}
              category={cat}
              linkText="See more in department"
            />
          ))}
        </div>

        {/* Value Propositions / Trust Badges */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center justify-center p-2">
            <Truck className="text-amazon-orange mb-2" size={28} />
            <span className="font-bold text-sm text-gray-900">Free Next-Day Delivery</span>
            <span className="text-xs text-gray-500">On eligible orders over ₹499</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <ShieldCheck className="text-amazon-orange mb-2" size={28} />
            <span className="font-bold text-sm text-gray-900">100% Authentic Products</span>
            <span className="text-xs text-gray-500">Directly sourced from trusted brands</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <RotateCcw className="text-amazon-orange mb-2" size={28} />
            <span className="font-bold text-sm text-gray-900">Easy 7-Day Returns</span>
            <span className="text-xs text-gray-500">Hassle-free replacement policy</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <Lock className="text-amazon-orange mb-2" size={28} />
            <span className="font-bold text-sm text-gray-900">Secure Payments</span>
            <span className="text-xs text-gray-500">Stripe encrypted & COD demo</span>
          </div>
        </div>

        {/* 3. Today's Deals Section */}
        <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="text-amazon-orange fill-amazon-orange" size={22} />
              <h2 className="text-xl font-bold text-gray-900">Today's Deals</h2>
              <span className="bg-red-700 text-white text-xs font-black px-2 py-0.5 rounded ml-2">
                UP TO 40% OFF
              </span>
            </div>
            <Link
              href="/products?deals=true"
              className="text-xs font-semibold text-amazon-blue hover:text-amazon-hover hover:underline flex items-center gap-1"
            >
              See all deals <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {deals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 4. Best Sellers Section */}
        <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="text-amber-500" size={22} />
              <h2 className="text-xl font-bold text-gray-900">Best Sellers in India</h2>
              <span className="text-xs text-gray-500 hidden sm:inline">
                Our most popular products based on sales
              </span>
            </div>
            <Link
              href="/products?sort=rating"
              className="text-xs font-semibold text-amazon-blue hover:text-amazon-hover hover:underline flex items-center gap-1"
            >
              View leaderboard <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 5. Electronics & Flagship Gadgets */}
        <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Top Audio & Electronics</h2>
              <p className="text-xs text-gray-500">Premium sound, noise cancellation, and accessories</p>
            </div>
            <Link
              href="/products?category=electronics"
              className="text-xs font-semibold text-amazon-blue hover:text-amazon-hover hover:underline flex items-center gap-1"
            >
              Shop all Electronics <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {electronics.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. Smartphones & 5G Devices */}
        <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Flagship Smartphones & 5G</h2>
              <p className="text-xs text-gray-500">Apple iPhone 15 Pro, Samsung Galaxy S24 Ultra & more</p>
            </div>
            <Link
              href="/products?category=smartphones"
              className="text-xs font-semibold text-amazon-blue hover:text-amazon-hover hover:underline flex items-center gap-1"
            >
              Explore all Smartphones <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {smartphones.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 7. Computers, Laptops & Workstations */}
        <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">High-Performance Laptops & Gear</h2>
              <p className="text-xs text-gray-500">MacBook Air M3, mechanical keyboards, and 4K displays</p>
            </div>
            <Link
              href="/products?category=computers"
              className="text-xs font-semibold text-amazon-blue hover:text-amazon-hover hover:underline flex items-center gap-1"
            >
              Shop Computing Gear <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {computers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 8. Fashion & Apparel */}
        <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Fashion & Streetwear</h2>
              <p className="text-xs text-gray-500">Jackets, sneakers, sunglasses and designer backpacks</p>
            </div>
            <Link
              href="/products?category=fashion"
              className="text-xs font-semibold text-amazon-blue hover:text-amazon-hover hover:underline flex items-center gap-1"
            >
              Shop Fashion <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {fashion.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 9. Home & Kitchen + Books 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Home & Kitchen */}
          <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-lg font-bold text-gray-900">Home & Kitchen Essentials</h2>
              <Link
                href="/products?category=home-and-kitchen"
                className="text-xs font-semibold text-amazon-blue hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {homeKitchen.slice(0, 2).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          {/* Books */}
          <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-lg font-bold text-gray-900">Top Reads & Bestsellers</h2>
              <Link
                href="/products?category=books"
                className="text-xs font-semibold text-amazon-blue hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {books.slice(0, 2).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>

        {/* 10. Featured Brands Banner */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <h3 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4">
            FEATURED AUTHENTIC BRANDS ON SHOPSPHERE
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600 font-bold text-lg">
            <span className="hover:text-black cursor-pointer transition-colors">APPLE</span>
            <span className="hover:text-black cursor-pointer transition-colors">SONY</span>
            <span className="hover:text-black cursor-pointer transition-colors">SAMSUNG</span>
            <span className="hover:text-black cursor-pointer transition-colors">BOSE</span>
            <span className="hover:text-black cursor-pointer transition-colors">DELL</span>
            <span className="hover:text-black cursor-pointer transition-colors">LOGITECH</span>
            <span className="hover:text-black cursor-pointer transition-colors">NIKE</span>
            <span className="hover:text-black cursor-pointer transition-colors">LEVI'S</span>
            <span className="hover:text-black cursor-pointer transition-colors">RAY-BAN</span>
            <span className="hover:text-black cursor-pointer transition-colors">DYSON</span>
          </div>
        </div>

        {/* 11. Newsletter Subscription Section */}
        <NewsletterForm />
      </div>
    </div>
  );
}
