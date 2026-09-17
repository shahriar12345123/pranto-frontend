import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';

export const CartSummary = ({ deliveryCharge = 60, isCheckout = false }) => {
  const { getCartSubtotal, getCartTotal, cartItems } = useCart();

  const subtotal = getCartSubtotal();
  const total = getCartTotal(deliveryCharge);
  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
        Order Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
          <span className="font-semibold text-slate-900">৳{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>Delivery Fee</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              Standard
            </span>
          </div>
          <span className="font-semibold text-slate-900">৳{formatPrice(deliveryCharge)}</span>
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
          <div>
            <span className="text-base font-bold text-slate-900">Total Amount</span>
            <p className="text-[11px] text-slate-400">Including estimated taxes</p>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-blue-600">
            ৳{formatPrice(total)}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      {!isCheckout && (
        <Link to="/checkout" className="block w-full">
          <Button variant="primary" size="lg" fullWidth icon={ArrowRight} iconPosition="right">
            Proceed to Checkout
          </Button>
        </Link>
      )}

      {/* Trust Badges */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
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
