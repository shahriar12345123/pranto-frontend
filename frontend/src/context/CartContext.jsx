import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const { user, session } = useAuth();
  
  const [cartItems, setCartItems] = useState([]);
  
  // URL to Express backend
  const API_URL = import.meta.env.VITE_API_URL || 'https://pranto-backend-1.onrender.com/api';

  // Load cart data
  useEffect(() => {
    const fetchCart = async () => {
      if (user && session?.access_token) {
        // Fetch from backend
        try {
          const res = await fetch(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          const data = await res.json();
          if (data.success) {
            setCartItems(data.data || []);
          }
        } catch (error) {
          console.error('Failed to fetch cart from backend', error);
        }
      } else {
        // Fetch from guest local storage
        try {
          const savedCart = localStorage.getItem('gazet_cart_items_guest');
          setCartItems(savedCart ? JSON.parse(savedCart) : []);
        } catch (e) {
          console.error('Failed to load guest cart', e);
          setCartItems([]);
        }
      }
    };

    fetchCart();
  }, [user, session]);

  // Save guest cart automatically
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem('gazet_cart_items_guest', JSON.stringify(cartItems));
      } catch (e) {
        console.error('Failed to save guest cart', e);
      }
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1, showNotification = true) => {
    if (!product || !product.id || quantity <= 0) return;

    const formattedItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || '',
      brand: product.brand || '',
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      image: product.image || (Array.isArray(product.images) ? product.images[0] : (typeof product.images === 'string' ? product.images : '')),
      stock: product.stock ?? 99,
      quantity: Math.min(quantity, product.stock || 99),
    };

    // Immediate optimistic state update
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(updated[existingItemIndex].quantity + quantity, product.stock || 99);
        updated[existingItemIndex] = { ...updated[existingItemIndex], ...formattedItem, quantity: newQty };
        return updated;
      } else {
        return [...prevItems, formattedItem];
      }
    });

    if (showNotification) {
      const formattedSubtotal = new Intl.NumberFormat('en-BD').format(product.price * quantity);
      addToast(`Added ${quantity > 1 ? `${quantity}× ` : ''}"${product.name}" to cart (৳${formattedSubtotal})`, 'success');
    }

    if (user && session?.access_token) {
      try {
        await fetch(`${API_URL}/cart`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}` 
          },
          body: JSON.stringify({ product: formattedItem, quantity })
        });
      } catch (error) {
        console.error('Failed to sync added item with backend cart', error);
      }
    }
  };

  const removeFromCart = async (productId, showNotification = true) => {
    const itemToRemove = cartItems.find((item) => item.id === productId);
    
    // Immediate optimistic state update
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    
    if (showNotification && itemToRemove) {
      addToast(`Removed "${itemToRemove.name}" from cart`, 'info');
    }

    if (user && session?.access_token) {
      try {
        await fetch(`${API_URL}/cart/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
      } catch (error) {
        console.error('Failed to remove item from backend cart', error);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Immediate optimistic update
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const maxQty = item.stock || 99;
          return { ...item, quantity: Math.min(quantity, maxQty) };
        }
        return item;
      })
    );

    if (user && session?.access_token) {
      try {
        await fetch(`${API_URL}/cart/${productId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}` 
          },
          body: JSON.stringify({ quantity })
        });
      } catch (error) {
        console.error('Failed to update quantity in backend cart', error);
      }
    }
  };

  const clearCart = async () => {
    // Immediate optimistic state update
    setCartItems([]);

    if (user && session?.access_token) {
      try {
        await fetch(`${API_URL}/cart`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
      } catch (error) {
        console.error('Failed to clear backend cart', error);
      }
    }
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartTotal = (deliveryCharge = 70) => {
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
