import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';

interface CategoryCardProps {
  title: string;
  category: Category;
  linkText?: string;
}

export function CategoryCard({
  title,
  category,
  linkText = 'See more',
}: CategoryCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
        <Link
          href={`/products?category=${category.slug}`}
          className="relative block w-full h-56 overflow-hidden rounded bg-gray-100 group"
        >
          {category.image_url && (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </Link>
        {category.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-1">{category.description}</p>
        )}
      </div>

      <div className="mt-4">
        <Link
          href={`/products?category=${category.slug}`}
          className="text-sm font-semibold text-amazon-blue hover:text-amazon-hover hover:underline"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}

