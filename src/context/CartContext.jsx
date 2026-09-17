import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CART_STORAGE_KEY = 'gazet_cart_items_v1';

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, showNotification = true) => {
    if (!product || quantity <= 0) return;

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(updated[existingItemIndex].quantity + quantity, product.stock || 99);
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            brand: product.brand,
            price: product.price,
            comparePrice: product.comparePrice,
            image: product.images?.[0] || '',
            stock: product.stock,
            quantity: Math.min(quantity, product.stock || 99),
          },
        ];
      }
    });

    if (showNotification) {
      const formattedSubtotal = new Intl.NumberFormat('en-BD').format(product.price * quantity);
      addToast(`Added ${quantity > 1 ? `${quantity}× ` : ''}"${product.name}" to cart (৳${formattedSubtotal})`, 'success');
    }
  };

  const removeFromCart = (productId, showNotification = true) => {
    const itemToRemove = cartItems.find((item) => item.id === productId);
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    if (showNotification && itemToRemove) {
      addToast(`Removed "${itemToRemove.name}" from cart`, 'info');
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const maxQty = item.stock || 99;
          return {
            ...item,
            quantity: Math.min(quantity, maxQty),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartTotal = (deliveryCharge = 60) => {
    return getCartSubtotal() + deliveryCharge;
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartSubtotal,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
