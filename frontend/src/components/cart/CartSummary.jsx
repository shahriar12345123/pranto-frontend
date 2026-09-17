import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';

export const CartSummary = ({ deliveryCharge = 70, isCheckout = false }) => {
  const { getCartSubtotal, getCartTotal, cartItems } = useCart();

  const subtotal = getCartSubtotal();
  const total = getCartTotal(deliveryCharge);
  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val);

  const freeShippingThreshold = 2500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs font-semibold text-slate-500">{cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
      </h3>

      {/* Free Shipping Progress */}
      <div className="bg-blue-50/80 border border-blue-100 p-3 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-blue-900">
            {remainingForFree > 0
              ? `Add ৳${formatPrice(remainingForFree)} more for FREE Delivery`
              : '🎉 You unlocked FREE Delivery!'}
          </span>
          <span className="text-blue-700">{progressPercent}%</span>
        </div>
        <div className="w-full bg-blue-200/70 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">৳{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>Delivery Fee</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
              {remainingForFree === 0 ? 'FREE' : 'Standard'}
            </span>
          </div>
          <span className="font-semibold text-slate-900">
            {remainingForFree === 0 ? '৳0' : `৳${formatPrice(deliveryCharge)}`}
          </span>
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
          <div>
            <span className="text-base font-bold text-slate-900">Total Amount</span>
            <p className="text-[11px] text-slate-400">Cash on Delivery across BD</p>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-blue-600">
            ৳{formatPrice(remainingForFree === 0 ? subtotal : total)}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      {!isCheckout && (
        <Link to="/checkout" state={{ fromCart: true }} className="block w-full">
          <Button variant="primary" size="lg" fullWidth icon={ArrowRight} iconPosition="right">
            Proceed to Checkout
          </Button>
        </Link>
      )}

      {/* Trust Badges */}
      <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Pay with Cash on Delivery at your doorstep</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>7-day easy warranty & replacement support</span>
        </div>
      </div>
    </div>
  );
};
