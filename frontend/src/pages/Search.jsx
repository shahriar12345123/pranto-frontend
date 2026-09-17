import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { ProductGrid } from '../components/product/ProductGrid';
import { SearchBar } from '../components/layout/SearchBar';
import { useProducts } from '../context/ProductContext';

export const Search = () => {
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || searchParams.get('id') || '';
  // Sanitize query by trimming and limiting length to prevent DOS / payload attacks
  const query = rawQuery.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 100);

  const searchResults = useMemo(() => {
    if (!query) return [];

    const lower = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(lower);
      const matchBrand = p.brand?.toLowerCase().includes(lower);
      const matchCategory = p.category?.toLowerCase().includes(lower);
      const matchDesc = p.description?.toLowerCase().includes(lower);
      const matchSku = p.sku?.toLowerCase().includes(lower);
      return matchName || matchBrand || matchCategory || matchDesc || matchSku;
    });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEO
        title={query ? `Search Results for "${query}"` : 'Search Gadgets'}
        description={`Search results for ${query || 'gadgets'} on Gazet Bangladesh.`}
        noIndex={true}
      />
      <Breadcrumb
        items={[
          { label: 'Search Results' },
          ...(query ? [{ label: `"${query}"` }] : []),
        ]}
      />

      <div className="mt-2 mb-8 space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Search Results
        </h1>

        <div className="max-w-md">
          <SearchBar placeholder="Search for gadgets, watches, chargers..." />
        </div>

        {query && (
          <p className="text-sm sm:text-base text-slate-600">
            {searchResults.length > 0 ? (
              <>
                Found <span className="font-bold text-slate-900">{searchResults.length}</span>{' '}
                gadgets for "<span className="font-semibold text-blue-600">{query}</span>"
              </>
            ) : (
              <>No results found for "<span className="font-semibold">{query}</span>"</>
            )}
          </p>
        )}
      </div>

      {/* Results grid */}
      <ProductGrid
        products={searchResults}
        emptyTitle="No products found"
        emptyDescription={`We couldn't find any gadgets matching "${query}". Try checking for spelling or search with broader keywords.`}
        emptyActionLabel="Browse All Products"
        emptyActionTo="/shop"
      />
    </div>
  );
};
