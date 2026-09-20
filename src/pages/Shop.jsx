import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown, RefreshCw, Check } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/common/Button';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/categories';

// Top-level PriceRangeFilter component to completely isolate input state and prevent focus loss on typing
const PriceRangeFilter = ({ minPriceParam, maxPriceParam, onApply }) => {
  const [localMin, setLocalMin] = useState(minPriceParam || '');
  const [localMax, setLocalMax] = useState(maxPriceParam || '');

  useEffect(() => {
    setLocalMin(minPriceParam || '');
  }, [minPriceParam]);

  useEffect(() => {
    setLocalMax(maxPriceParam || '');
  }, [maxPriceParam]);

  const handleMinChange = (e) => {
    const sanitized = e.target.value.replace(/\D/g, '');
    setLocalMin(sanitized);
  };

  const handleMaxChange = (e) => {
    const sanitized = e.target.value.replace(/\D/g, '');
    setLocalMax(sanitized);
  };

  const handleBlur = () => {
    onApply(localMin, localMax);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onApply(localMin, localMax);
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
        Price Budget (৳)
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="minPriceInput" className="text-[11px] text-slate-500 block mb-1">
            Min Budget (৳)
          </label>
          <input
            id="minPriceInput"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={localMin}
            onChange={handleMinChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 bg-white"
          />
        </div>
        <div>
          <label htmlFor="maxPriceInput" className="text-[11px] text-slate-500 block mb-1">
            Max Budget (৳)
          </label>
          <input
            id="maxPriceInput"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="20000"
            value={localMax}
            onChange={handleMaxChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export const Shop = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // URL state
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedBrand = searchParams.get('brand') || 'all';
  const selectedSort = searchParams.get('sort') || 'featured';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';

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
    setSearchParams({}, { replace: true, preventScrollReset: true });
  };

  const searchQuery = searchParams.get('q') || searchParams.get('search') || '';

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    minPriceParam !== '' ||
    maxPriceParam !== '' ||
    searchQuery !== '' ||
    selectedSort !== 'featured';

  // Available brands derived from products
  const availableBrands = useMemo(() => {
    const brandsSet = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(brandsSet).sort();
  }, [products]);

  // Filter & Sort Logic against mock data
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Keyword Search filter
    if (searchQuery) {
      const rawLower = searchQuery.toLowerCase().trim();
      const tokens = rawLower.split(/\s+/).filter(Boolean);

      result = result.filter((p) => {
        const fieldList = [
          p.name,
          p.brand,
          p.category,
          p.description,
          p.shortDescription,
          p.sku,
          p.slug,
          Array.isArray(p.tags) ? p.tags.join(' ') : p.tags,
          Array.isArray(p.features) ? p.features.join(' ') : p.features,
        ].filter(Boolean);

        const combinedText = fieldList.join(' ').toLowerCase();
        const combinedTextNoSpaces = combinedText.replace(/[\s\-_]+/g, '');

        return tokens.every((token) => {
          const tokenNoSpaces = token.replace(/[\s\-_]+/g, '');
          return (
            combinedText.includes(token) ||
            (tokenNoSpaces.length > 2 && combinedTextNoSpaces.includes(tokenNoSpaces))
          );
        });
      });
    }

    // Earbud Feature Collection filter (if specific category matches)
    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'wireless-earbuds') {
      const matched = result.filter((p) => p.category === selectedCategory);
      if (matched.length > 0) {
        result = matched;
      }
    }

    // Brand filter
    if (selectedBrand && selectedBrand !== 'all') {
      result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Min price budget
    if (minPriceParam) {
      const min = Number(minPriceParam);
      if (!isNaN(min)) {
        result = result.filter((p) => p.price >= min);
      }
    }

    // Max price budget
    if (maxPriceParam) {
      const max = Number(maxPriceParam);
      if (!isNaN(max)) {
        result = result.filter((p) => p.price <= max);
      }
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
  }, [selectedCategory, selectedBrand, selectedSort, minPriceParam, maxPriceParam, searchQuery, products]);

  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Brand Section */}
      {availableBrands.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
            Earbud Brand
          </h4>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => updateFilter('brand', 'all')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                selectedBrand === 'all'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>All Brands</span>
              <span className="text-xs text-slate-400">{products.length}</span>
            </button>
            {availableBrands.map((b) => {
              const isSelected = selectedBrand.toLowerCase() === b.toLowerCase();
              const count = products.filter((p) => p.brand?.toLowerCase() === b.toLowerCase()).length;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => updateFilter('brand', b)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{b}</span>
                  <span className="text-xs text-slate-400">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}


      {/* Price Filter Section */}
      <PriceRangeFilter
        minPriceParam={minPriceParam}
        maxPriceParam={maxPriceParam}
        onApply={updatePriceFilter}
      />

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
    ? `${activeCategoryObj.name} - Wireless Earbuds`
    : 'Shop Wireless Earbuds';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEO
        title={pageTitle}
        description={
          activeCategoryObj
            ? `Explore genuine ${activeCategoryObj.name.toLowerCase()} wireless earbuds with official warranty and fast Cash on Delivery in Bangladesh.`
            : 'Explore genuine TWS and ANC wireless earbuds from Anker, Baseus, QCY, Soundpeats, and Realme with fast delivery across Bangladesh.'
        }
        keywords="wireless earbuds bd, buy tws earbuds bangladesh, anc earbuds dhaka"
      />
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Shop Earbuds' }]} />

      {/* Header Banner */}
      <div className="mt-2 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Shop Wireless Earbuds
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Discover our complete collection of genuine TWS & Active Noise Cancelling Earbuds.
          </p>
        </div>
        <p className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
          Showing {filteredProducts.length} earbuds
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
          {renderFilterContent()}
        </aside>

        {/* Right Product Grid Area */}
        <div className="lg:col-span-9 flex flex-col gap-6 min-h-[500px] sm:min-h-[650px]">
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
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Search: "{searchQuery}"
                  <button onClick={() => updateFilter('q', '')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Category: {selectedCategory}
                  <button onClick={() => updateFilter('category', 'all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(minPriceParam || maxPriceParam) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  Price: ৳{minPriceParam || 0} - ৳{maxPriceParam || '∞'}
                  <button
                    onClick={() => {
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
              {renderFilterContent()}
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
