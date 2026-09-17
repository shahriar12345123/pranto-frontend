import React from 'react';
import { CategoryCard } from './CategoryCard';
import { CategorySkeleton } from '../common/Skeleton';

export const CategoryGrid = ({ categories = [], loading = false, variant = 'default', limit }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    );
  }

  const items = limit ? categories.slice(0, limit) : categories;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {items.map((cat) => (
        <CategoryCard key={cat.id} category={cat} variant={variant} />
      ))}
    </div>
  );
};
