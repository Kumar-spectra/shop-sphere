import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: number;
}

export function RatingStars({
  rating = 4.5,
  reviewCount,
  showCount = true,
  size = 16,
}: RatingStarsProps) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((index) => {
          const filled = index <= rounded;
          const half = !filled && index - 0.5 <= rounded;
          return (
            <Star
              key={index}
              size={size}
              className={`${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-300 text-amber-400 opacity-80'
                  : 'text-gray-300'
              }`}
            />
          );
        })}
      </div>
      {showCount && (
        <span className="text-amazon-blue hover:text-amazon-hover hover:underline cursor-pointer font-medium ml-0.5">
          {rating.toFixed(1)} {reviewCount ? `(${reviewCount.toLocaleString('en-IN')})` : ''}
        </span>
      )}
    </div>
  );
}

