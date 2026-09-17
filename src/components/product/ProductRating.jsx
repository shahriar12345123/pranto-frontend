import React from 'react';
import { Star } from 'lucide-react';

export const ProductRating = ({ rating = 5.0, reviewCount, showCount = true, size = 'sm', className = '' }) => {
  const isLarge = size === 'md';

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-amber-400">
        <Star className={`${isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} fill-amber-400 text-amber-400`} />
      </div>
      <span className={`font-semibold text-slate-800 ${isLarge ? 'text-sm' : 'text-xs'}`}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className={`text-slate-400 ${isLarge ? 'text-sm' : 'text-xs'}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
