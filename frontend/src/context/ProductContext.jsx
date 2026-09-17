import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) {
        throw new Error(`Failed to load products (${res.status})`);
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch products from backend:', err);
      setError(err.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProduct = useCallback(
    (identifier) => {
      if (!identifier) return null;
      return products.find(
        (p) => p.slug === identifier || p.id === identifier
      ) || null;
    },
    [products]
  );

  const getProductsByCategory = useCallback(
    (categorySlug) => {
      if (!categorySlug || categorySlug === 'all') return products;
      return products.filter((p) => p.category === categorySlug);
    },
    [products]
  );

  const value = {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
    getProduct,
    getProductsByCategory,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
