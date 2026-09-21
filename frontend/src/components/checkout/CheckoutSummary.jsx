import React from 'react';
import { ShieldCheck, Lock, Minus, Plus } from 'lucide-react';

export const CheckoutSummary = ({ items = [], deliveryCharge = 70, onQuantityChange, onColorChange }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryCharge;
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-4 sm:gap-5 lg:sticky lg:top-28 min-w-0 w-full">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between min-w-0">
        <span className="truncate">Order Summary</span>
        <span className="text-xs font-semibold text-slate-500 shrink-0 ml-2">
          {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
        </span>
      </h3>

      {/* Item list with quantity controls */}
      <div className="max-h-72 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100 min-w-0 w-full">
        {items.map((item) => {
          const colorList = Array.isArray(item.colors) && item.colors.length > 0 ? item.colors : ['Black', 'White'];
          const currentColor = item.selectedColor || item.color || colorList[0];

          return (
            <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3 text-xs sm:text-sm min-w-0 w-full">
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 p-0.5 shrink-0 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate leading-snug" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-slate-400 text-[11px]">Unit: ৳{formatPrice(item.price)}</span>
                  {/* Color Selector */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-medium">Color:</span>
                    <select
                      value={currentColor}
                      onChange={(e) => onColorChange && onColorChange(item.id, e.target.value)}
                      className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                    >
                      {colorList.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => onQuantityChange && onQuantityChange(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="w-6 h-6 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <Minus className="w-3 h-3 text-slate-600" />
                  </button>
                  <span className="w-6 text-center font-semibold text-slate-800 text-xs sm:text-sm tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => onQuantityChange && onQuantityChange(item.id, 1)}
                    className="w-6 h-6 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3 h-3 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Line total */}
              <span className="font-bold text-slate-900 shrink-0 pt-0.5 whitespace-nowrap ml-1 text-right text-xs sm:text-sm">
                ৳{formatPrice(item.price * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Totals Breakdown for COD Prepayment */}
      <div className="space-y-2.5 text-sm border-t border-slate-100 pt-3 sm:pt-4 min-w-0 w-full">
        <div className="flex justify-between text-slate-600 text-xs sm:text-sm">
          <span>Products Subtotal</span>
          <span className="font-semibold text-slate-900">৳{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-slate-600 text-xs sm:text-sm">
          <span>Delivery Charge</span>
          <span className="font-semibold text-slate-900">৳{formatPrice(deliveryCharge)}</span>
        </div>

        <div className="border-t border-slate-100 pt-2.5 flex justify-between items-baseline gap-2 min-w-0">
          <span className="text-xs sm:text-sm font-semibold text-slate-500 shrink-0">Total Order Value</span>
          <span className="text-sm sm:text-base font-bold text-slate-800 shrink-0">
            ৳{formatPrice(total)}
          </span>
        </div>

        {/* Highlighted Payment Split Boxes */}
        <div className="mt-3 space-y-2 pt-1">
          {/* Pay NOW Box */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-950 block">Pay NOW (Delivery Charge)</span>
              <span className="text-[11px] text-emerald-700 font-medium">Via bKash / Nagad / Rocket</span>
            </div>
            <span className="text-lg sm:text-xl font-black text-emerald-700">
              ৳{formatPrice(deliveryCharge)}
            </span>
          </div>

          {/* Pay ON DELIVERY Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-950 block">Pay ON DELIVERY (Cash)</span>
              <span className="text-[11px] text-blue-700 font-medium">Products cost to rider upon delivery</span>
            </div>
            <span className="text-lg sm:text-xl font-black text-blue-700">
              ৳{formatPrice(subtotal)}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 text-[11px] sm:text-xs text-slate-500 space-y-2 bg-slate-50 p-3 rounded-xl min-w-0">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="leading-tight">Advance delivery charge required to confirm COD order.</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="leading-tight">Guaranteed genuine products &amp; fast dispatch.</span>
        </div>
      </div>
    </div>
  );
};
