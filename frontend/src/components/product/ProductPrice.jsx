import React from 'react';

export const ProductPrice = ({ price, comparePrice, discount, size = 'md', className = '' }) => {
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-BD').format(val);
  };

  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      <span
        className={`font-bold text-slate-900 ${
          isLarge ? 'text-2xl sm:text-3xl font-extrabold text-blue-600' : isSmall ? 'text-sm font-semibold' : 'text-base sm:text-lg'
        }`}
      >
        ৳{formatPrice(price)}
      </span>

      {comparePrice && comparePrice > price && (
        <span
          className={`text-slate-400 line-through ${
            isLarge ? 'text-base sm:text-lg' : isSmall ? 'text-xs' : 'text-xs sm:text-sm'
          }`}
        >
          ৳{formatPrice(comparePrice)}
        </span>
      )}

      {discount && discount > 0 && isLarge && (
        <span className="px-2 py-0.5 text-xs font-bold text-red-600 bg-red-50 rounded-md border border-red-100">
          {discount}% OFF
        </span>
      )}
    </div>
  );
};
