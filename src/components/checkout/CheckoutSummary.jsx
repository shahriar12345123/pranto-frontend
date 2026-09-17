import React from 'react';
import { ShieldCheck, Truck, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CheckoutSummary = ({ deliveryCharge = 60 }) => {
  const { cartItems, getCartSubtotal, getCartTotal } = useCart();

  const subtotal = getCartSubtotal();
  const total = getCartTotal(deliveryCharge);
  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5 sticky top-28">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
        Order Summary ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
      </h3>

      {/* Item preview list */}
      <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
        {cartItems.map((item) => (
          <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-100 p-0.5 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-800 truncate">{item.name}</p>
                <p className="text-slate-400">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="font-semibold text-slate-900 shrink-0">
              ৳{formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals Calculation */}
      <div className="space-y-2.5 text-sm border-t border-slate-100 pt-4">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">৳{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Delivery Charge</span>
          <span className="font-semibold text-slate-900">৳{formatPrice(deliveryCharge)}</span>
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
          <span className="text-base font-bold text-slate-900">Total Payable</span>
          <span className="text-xl sm:text-2xl font-extrabold text-blue-600">
            ৳{formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-2 bg-slate-50 p-3 rounded-xl">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>No prepayment required. Pay upon delivery.</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Guaranteed genuine products & fast handling.</span>
        </div>
      </div>
    </div>
  );
};
