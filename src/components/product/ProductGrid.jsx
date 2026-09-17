import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { PackageSearch } from 'lucide-react';

export const ProductGrid = ({
  products = [],
  loading = false,
  skeletonCount = 8,
  emptyTitle = 'No gadgets found',
  emptyDescription = 'Try adjusting your filters or search keywords.',
  emptyActionLabel,
  emptyActionTo,
  onEmptyAction,
  className = '',
}) => {
  if (loading) {
    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 ${className}`}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          icon={PackageSearch}
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          actionTo={emptyActionTo}
          onAction={onEmptyAction}
        />
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
