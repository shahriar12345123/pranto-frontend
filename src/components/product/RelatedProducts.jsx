import React from 'react';
import { ProductGrid } from './ProductGrid';

export const RelatedProducts = ({ currentProductId, category, products = [] }) => {
  const related = products
    .filter((p) => p.category === category && p.id !== currentProductId)
    .slice(0, 4);

  // Fallback if not enough category matches
  const displayProducts =
    related.length >= 4
      ? related
      : [
          ...related,
          ...products.filter((p) => p.id !== currentProductId && !related.some((r) => r.id === p.id)),
        ].slice(0, 4);

  if (displayProducts.length === 0) return null;

  return (
    <section className="pt-12 sm:pt-16 border-t border-slate-200">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            You May Also Like
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Complementary gadgets and popular alternatives
          </p>
        </div>
      </div>
      <ProductGrid products={displayProducts} />
    </section>
  );
};
