import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { CheckoutSummary } from '../components/checkout/CheckoutSummary';
import { EmptyState } from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { siteConfig } from '../data/site';

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [selectedDivision, setSelectedDivision] = useState('Dhaka');

  // Auth guard — redirect to signin if user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      addToast('Please sign in to proceed with checkout.', 'warning');
      navigate('/signin', { state: { from: { pathname: '/checkout' }, checkoutState: location.state }, replace: true });
    }
  }, [user, authLoading, navigate, location.state]);

  // Show loader while auth is resolving
  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
        <div className="w-9 h-9 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render anything while redirect is in progress
  if (!user) return null;

  // Check if a specific item is being purchased directly via "Buy Now"
  const directBuyItem = useMemo(() => {
    if (location.state?.directBuyItem) {
      try {
        sessionStorage.setItem('gazet_buy_now_item', JSON.stringify(location.state.directBuyItem));
      } catch {
        // ignore
      }
      return location.state.directBuyItem;
    }

    if (location.state?.fromCart) {
      try {
        sessionStorage.removeItem('gazet_buy_now_item');
      } catch {
        // ignore
      }
      return null;
    }

    try {
      const saved = sessionStorage.getItem('gazet_buy_now_item');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  const isDirectBuy = Boolean(directBuyItem);
  // If direct buy, show ONLY the specific item being ordered; do not include items from the cart
  const checkoutItems = isDirectBuy ? [directBuyItem] : cartItems;

  // Local editable copy of items so the user can adjust quantities at checkout
  const [localItems, setLocalItems] = useState(() => checkoutItems);

  const handleQuantityChange = (itemId, delta) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleColorChange = (itemId, newColor) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, selectedColor: newColor, color: newColor }
          : item
      )
    );
  };

  // Inside Dhaka: ৳70, Outside Dhaka: ৳130
  const deliveryCharge =
    selectedDivision.toLowerCase() === 'dhaka'
      ? siteConfig.deliveryChargeInsideDhaka
      : siteConfig.deliveryChargeOutsideDhaka;

  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SEO title="Checkout" noIndex={true} />
        <Breadcrumb items={[{ label: 'Checkout' }]} />
        <div className="mt-8">
          <EmptyState
            icon={ShoppingBag}
            title="No items to checkout"
            description="Please select a gadget to order or add items to your cart before proceeding to checkout."
            actionLabel="Browse Products"
            actionTo="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 min-w-0">
      <SEO title="Secure Checkout" noIndex={true} />
      <Breadcrumb
        items={[
          ...(isDirectBuy
            ? [{ label: 'Shop', to: '/shop' }, { label: directBuyItem.name, to: `/product/${directBuyItem.slug}` }]
            : [{ label: 'Cart', to: '/cart' }]),
          { label: 'Checkout' },
        ]}
      />

      <div className="mt-2 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 sm:pb-5 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight break-words">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 break-words">
            {isDirectBuy
              ? `Ordering "${directBuyItem.name}" with fast Cash on Delivery.`
              : 'Fill in your delivery details. Cash on Delivery is available across Bangladesh.'}
          </p>
        </div>
        <Link
          to={isDirectBuy ? `/product/${directBuyItem.slug}` : '/cart'}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isDirectBuy ? 'Back to Product' : 'Return to Cart'}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start min-w-0">
        {/* Left: Customer Information & Payment form */}
        <div className="lg:col-span-8 min-w-0 w-full">
          <CheckoutForm
            items={localItems}
            deliveryCharge={deliveryCharge}
            isDirectBuy={isDirectBuy}
            onDivisionChange={(div) => setSelectedDivision(div)}
          />
        </div>

        {/* Right: Sticky Order summary with quantity controls & color selection */}
        <div className="lg:col-span-4 min-w-0 w-full">
          <CheckoutSummary
            items={localItems}
            deliveryCharge={deliveryCharge}
            onQuantityChange={handleQuantityChange}
            onColorChange={handleColorChange}
          />
        </div>
      </div>
    </div>
  );
};
