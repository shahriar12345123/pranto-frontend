import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { CheckoutSummary } from '../components/checkout/CheckoutSummary';
import { EmptyState } from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { siteConfig } from '../data/site';

export const Checkout = () => {
  const { cartItems } = useCart();
  const [selectedDivision, setSelectedDivision] = useState('Dhaka');

  // Inside Dhaka: ৳60, Outside Dhaka: ৳120
  const deliveryCharge =
    selectedDivision.toLowerCase() === 'dhaka'
      ? siteConfig.deliveryChargeInsideDhaka
      : siteConfig.deliveryChargeOutsideDhaka;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumb items={[{ label: 'Checkout' }]} />
        <div className="mt-8">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="You need to add at least one gadget to your cart before proceeding to checkout."
            actionLabel="Browse Products"
            actionTo="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Breadcrumb
        items={[
          { label: 'Cart', to: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <div className="mt-2 mb-8 flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in your delivery details. Cash on Delivery is available across Bangladesh.
          </p>
        </div>
        <Link
          to="/cart"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Cart</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Information & Payment form */}
        <div className="lg:col-span-8">
          <CheckoutForm
            deliveryCharge={deliveryCharge}
            onDivisionChange={(div) => setSelectedDivision(div)}
          />
        </div>

        {/* Right: Sticky Order summary */}
        <div className="lg:col-span-4">
          <CheckoutSummary deliveryCharge={deliveryCharge} />
        </div>
      </div>
    </div>
  );
};
