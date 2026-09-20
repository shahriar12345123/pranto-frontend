import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const { cartItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SEO title="Shopping Cart" noIndex={true} />
        <Breadcrumb items={[{ label: 'Cart' }]} />
        <div className="mt-8">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Looks like you haven't added any gadgets or accessories yet."
            actionLabel="Start Shopping"
            actionTo="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 min-w-0">
      <SEO title="Shopping Cart" noIndex={true} />
      <Breadcrumb items={[{ label: 'Cart' }]} />

      <div className="mt-2 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-5 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight break-words">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 break-words">
            Review your items and proceed to fast checkout with Cash on Delivery.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={clearCart}
            className="text-xs sm:text-sm text-slate-500 hover:text-red-600 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start min-w-0">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4 min-w-0 w-full">
          <div className="space-y-3">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Cart Summary */}
        <div className="lg:col-span-4">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};
