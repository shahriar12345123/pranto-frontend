import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartItem = ({ item }) => {
  const navigate = useNavigate();
  const { updateQuantity, removeFromCart } = useCart();

  const handleBuyThisNow = () => {
    navigate('/checkout', { state: { directBuyItem: item } });
  };

  const handleDecrease = () => updateQuantity(item.id, item.quantity - 1);
  const handleIncrease = () => updateQuantity(item.id, item.quantity + 1);

  const handleDirectChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) updateQuantity(item.id, val);
  };

  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
      {/* ── Row: image + info + actions ── */}
      <div className="flex gap-4">
        {/* Thumbnail */}
        <Link
          to={`/product/${item.slug}`}
          className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 border border-slate-100 p-1.5 overflow-hidden flex items-center justify-center"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </Link>

        {/* Info block */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          {/* Name & brand */}
          <div className="min-w-0">
            {item.brand && (
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {item.brand}
              </span>
            )}
            <Link
              to={`/product/${item.slug}`}
              className="block text-sm sm:text-base font-semibold text-slate-900 hover:text-blue-600 transition-colors leading-snug line-clamp-2"
            >
              {item.name}
            </Link>
            <p className="text-xs text-slate-500 mt-0.5">
              Unit:&nbsp;
              <span className="font-semibold text-slate-700">৳{formatPrice(item.price)}</span>
            </p>
          </div>

          {/* ── Controls row ── */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Qty stepper */}
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-xs">
              <button
                type="button"
                onClick={handleDecrease}
                aria-label="Decrease quantity"
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="1"
                max={item.stock || 99}
                value={item.quantity}
                onChange={handleDirectChange}
                className="w-10 h-8 text-center text-sm font-semibold bg-white border-x border-slate-200 text-slate-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Item quantity"
              />
              <button
                type="button"
                onClick={handleIncrease}
                disabled={item.quantity >= (item.stock || 99)}
                aria-label="Increase quantity"
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Line total */}
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-slate-400 font-medium">Total</span>
              <span className="text-sm sm:text-base font-bold text-slate-900">
                ৳{formatPrice(item.price * item.quantity)}
              </span>
            </div>

            {/* Action buttons — pushed right on all sizes */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={handleBuyThisNow}
                title="Order only this item"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                title="Remove item"
                aria-label="Remove item"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
