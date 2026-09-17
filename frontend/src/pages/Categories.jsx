import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { CategoryGrid } from '../components/category/CategoryGrid';
import { categories } from '../data/categories';

export const Categories = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEO
        title="All Gadget Categories"
        description="Explore all categories of gadgets including earbuds, smartwatches, power banks, chargers, cables, and accessories at Gazet Bangladesh."
        keywords="gadget categories bd, electronics categories bangladesh"
      />
      <Breadcrumb items={[{ label: 'Categories' }]} />

      <div className="mt-2 mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Categories
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Browse through our curated collection of consumer gadgets, wearable technology, power gear, and everyday accessories.
        </p>
      </div>

      <CategoryGrid categories={categories} />
    </div>
  );
};
