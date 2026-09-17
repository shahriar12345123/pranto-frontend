import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductGrid } from '../components/product/ProductGrid';
import { EmptyState } from '../components/common/EmptyState';
import { categories } from '../data/categories';
import { products } from '../data/products';

export const Category = () => {
  const { slug } = useParams();
  const [selectedSort, setSelectedSort] = useState('featured');

  const category = categories.find((c) => c.slug === slug);

  const categoryProducts = useMemo(() => {
    let result = products.filter((p) => p.category === slug);

    switch (selectedSort) {
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    return result;
  }, [slug, selectedSort]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Category Not Found"
          description="The category you are looking for does not exist or has been removed."
          actionLabel="Browse All Categories"
          actionTo="/categories"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Categories', to: '/categories' },
          { label: category.name },
        ]}
      />

      {/* Category Hero Banner */}
      <div className="mt-4 mb-10 relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md">
        <div className="absolute inset-0 opacity-25">
          <img
            src={category.bannerImage || category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 block">
            Category
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Subheader & Sort Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <p className="text-sm font-semibold text-slate-700">
          Showing {categoryProducts.length} items in {category.name}
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="cat-sort" className="text-xs text-slate-500 font-medium hidden sm:inline">
            Sort by:
          </label>
          <select
            id="cat-sort"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="text-xs sm:text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={categoryProducts}
        emptyTitle={`No products found in ${category.name}`}
        emptyDescription="We are currently stocking up this section. Please check back soon."
        emptyActionLabel="Browse Other Categories"
        emptyActionTo="/categories"
      />
    </div>
  );
};
