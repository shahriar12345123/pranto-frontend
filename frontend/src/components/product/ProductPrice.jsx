import React from 'react';

export const ProductPrice = ({ price, comparePrice, discount, size = 'md', className = '' }) => {
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-BD').format(val);
  };

  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  const computedDiscount =
    discount && discount > 0
      ? discount
      : comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : null;

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

      {computedDiscount && computedDiscount > 0 && (
        <span
          className={`font-bold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200/80 ${
            isLarge ? 'px-2 py-0.5 text-xs' : 'px-1.5 py-0.5 text-[10px]'
          }`}
        >
          {computedDiscount}% OFF
        </span>
      )}
    </div>
  );
};
