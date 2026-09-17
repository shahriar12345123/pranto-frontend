import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown, RefreshCw, Check } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/common/Button';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/categories';

export const Shop = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // URL state
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedSort = searchParams.get('sort') || 'featured';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const onSaleOnly = searchParams.get('onSale') === 'true';

  // Local state for price range inputs to prevent page scrolling/jumping while typing
  const [localMinPrice, setLocalMinPrice] = useState(minPriceParam);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPriceParam);

  // Keep local price inputs synced if URL search params change externally
  useEffect(() => {
    setLocalMinPrice(minPriceParam);
  }, [minPriceParam]);

  useEffect(() => {
    setLocalMaxPrice(maxPriceParam);
  }, [maxPriceParam]);

  // Helper to update URL search params cleanly without resetting scroll position
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'all' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    setSearchParams(newParams, { replace: true, preventScrollReset: true });
  };

  const updatePriceFilter = (minVal, maxVal) => {
    const newParams = new URLSearchParams(searchParams);
    if (!minVal && minVal !== 0) {
      newParams.delete('minPrice');
    } else {
      newParams.set('minPrice', String(minVal));
    }

    if (!maxVal && maxVal !== 0) {
      newParams.delete('maxPrice');
    } else {
      newParams.set('maxPrice', String(maxVal));
    }
    setSearchParams(newParams, { replace: true, preventScrollReset: true });
  };

  const clearAllFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setSearchParams({}, { replace: true, preventScrollReset: true });
  };

  const handleMinPriceChange = (e) => {
    // Enforce numeric only input (digits 0-9)
    const sanitized = e.target.value.replace(/\D/g, '');
    setLocalMinPrice(sanitized);
  };

  const handleMaxPriceChange = (e) => {
    // Enforce numeric only input (digits 0-9)
    const sanitized = e.target.value.replace(/\D/g, '');
    setLocalMaxPrice(sanitized);
  };

  const handlePriceKeyDown = (e) => {
    if (e.key === 'Enter') {
      updatePriceFilter(localMinPrice, localMaxPrice);
    }
  };

  const handlePriceBlur = () => {
    updatePriceFilter(localMinPrice, localMaxPrice);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    minPriceParam !== '' ||
    maxPriceParam !== '' ||
    inStockOnly ||
    onSaleOnly ||
    selectedSort !== 'featured';

  // Filter & Sort Logic against mock data
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Min price
    if (minPriceParam) {
      const min = Number(minPriceParam);
      if (!isNaN(min)) {
        result = result.filter((p) => p.price >= min);
      }
    }

    // Max price
    if (maxPriceParam) {
      const max = Number(maxPriceParam);
      if (!isNaN(max)) {
        result = result.filter((p) => p.price <= max);
      }
    }

    // Stock
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sale
    if (onSaleOnly) {
      result = result.filter(
        (p) => (p.discount && p.discount > 0) || (p.comparePrice && p.comparePrice > p.price)
      );
    }

    // Sorting
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
  }, [selectedCategory, selectedSort, minPriceParam, maxPriceParam, inStockOnly, onSaleOnly]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Section */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
          Category
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => updateFilter('category', 'all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            <span className="text-xs text-slate-400">{products.length}</span>
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateFilter('category', cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-slate-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter Section */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
          Price Range (৳)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="minPrice" className="text-[11px] text-slate-500 block mb-1">
              Min (৳)
            </label>
            <input
              id="minPrice"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={localMinPrice}
              onChange={handleMinPriceChange}
              onBlur={handlePriceBlur}
              onKeyDown={handlePriceKeyDown}
              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="text-[11px] text-slate-500 block mb-1">
              Max (৳)
            </label>
            <input
              id="maxPrice"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="50000"
              value={localMaxPrice}
              onChange={handleMaxPriceChange}
              onBlur={handlePriceBlur}
              onKeyDown={handlePriceKeyDown}
              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
          Availability & Offers
        </h4>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => updateFilter('inStock', e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>In Stock Only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={onSaleOnly}
              onChange={(e) => updateFilter('onSale', e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>On Sale / Discounted</span>
          </label>
        </div>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-slate-100">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            icon={RefreshCw}
            onClick={clearAllFilters}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const pageTitle = activeCategoryObj
    ? `Shop ${activeCategoryObj.name}`
    : 'Shop All Gadgets & Electronics';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEO
        title={pageTitle}
        description={
          activeCategoryObj
            ? `Browse our top collection of genuine ${activeCategoryObj.name.toLowerCase()} with official warranty and fast Cash on Delivery in Bangladesh.`
            : 'Explore all smart electronics, audio gear, chargers, cables, and mobile accessories with fast delivery across Bangladesh.'
        }
        keywords="shop gadgets bd, online tech store bangladesh, buy electronics bd"
      />
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Shop All Products' }]} />

      {/* Header Banner */}
      <div className="mt-2 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Shop All Products
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Discover our complete collection of genuine gadgets and accessories.
          </p>
        </div>
        <p className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
          Showing {filteredProducts.length} products
        </p>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          <FilterContent />
        </aside>

        {/* Right Product Grid Area */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Controls Bar (Mobile filter toggle + Sorting) */}
          <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 p-3 sm:p-4 rounded-xl shadow-xs">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <label htmlFor="sort" className="text-xs sm:text-sm text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort"
                value={selectedSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-medium">Active:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Category: {selectedCategory}
                  <button onClick={() => updateFilter('category', 'all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  In Stock Only
                  <button onClick={() => updateFilter('inStock', false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {onSaleOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  On Sale
                  <button onClick={() => updateFilter('onSale', false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(minPriceParam || maxPriceParam) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  Price: ৳{minPriceParam || 0} - ৳{maxPriceParam || '∞'}
                  <button
                    onClick={() => {
                      setLocalMinPrice('');
                      setLocalMaxPrice('');
                      updatePriceFilter('', '');
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            emptyTitle="No products match your filters"
            emptyDescription="Try clearing some filter options or reset all filters to view available gadgets."
            emptyActionLabel="Reset All Filters"
            onEmptyAction={clearAllFilters}
          />
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto p-5">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Filter Products</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterContent />
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters ({filteredProducts.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
