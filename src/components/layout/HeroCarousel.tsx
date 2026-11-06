'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'Flagship Electronics & Gadgets',
    subtitle: 'Up to 40% off on Noise Cancelling Headphones, Cameras & Smart Gear',
    cta: 'Shop Electronics Deals',
    href: '/products?category=electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80',
    tag: 'LIMITED TIME DEAL',
  },
  {
    id: 2,
    title: 'The Future of Mobile Intelligence',
    subtitle: 'Explore iPhone 15 Pro, Galaxy S24 Ultra & Pixel 8 Pro with No Cost EMI',
    cta: 'Upgrade Your Smartphone',
    href: '/products?category=smartphones',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&q=80',
    tag: 'NEW ARRIVALS',
  },
  {
    id: 3,
    title: 'Next-Gen Computing & Workstations',
    subtitle: 'MacBook Air M3, Dell XPS, Ultra-wide 4K Monitors and Mechanical Keyboards',
    cta: 'Explore Workstation Setup',
    href: '/products?category=computers',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80',
    tag: 'PRO PRODUCTIVITY',
  },
  {
    id: 4,
    title: 'Modern Living & Smart Kitchen',
    subtitle: 'Espresso Machines, Air Fryers, Cordless Vacuums and Premium Cookware',
    cta: 'Transform Your Home',
    href: '/products?category=home-and-kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80',
    tag: 'BESTSELLERS',
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          className="object-cover opacity-60 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        {/* Amazon style gradient fade into bottom content */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#F5F6F7] to-transparent pointer-events-none" />
      </div>

      {/* Banner Content */}
      <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center px-6 sm:px-12 text-white z-10 pb-16">
        <span className="inline-block bg-amazon-orange text-gray-950 text-xs font-black px-2.5 py-1 rounded w-fit mb-3 tracking-wider">
          {slide.tag}
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold max-w-2xl leading-tight drop-shadow-md">
          {slide.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-200 mt-3 max-w-xl drop-shadow">
          {slide.subtitle}
        </p>

        <div className="mt-6">
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 bg-amazon-yellow hover:bg-amazon-orange text-gray-950 font-bold px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm"
          >
            {slide.cta} →
          </Link>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-md bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all focus:outline-none"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-md bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all focus:outline-none"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${
              idx === current ? 'w-8 bg-amazon-orange' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

