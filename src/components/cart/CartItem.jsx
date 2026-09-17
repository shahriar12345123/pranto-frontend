import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrease = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDirectChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      updateQuantity(item.id, val);
    }
  };

  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
      {/* Product info & image */}
      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        <Link
          to={`/product/${item.slug}`}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0 overflow-hidden"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </Link>
        <div className="flex-1 min-w-0">
          {item.brand && (
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {item.brand}
            </span>
          )}
          <Link
            to={`/product/${item.slug}`}
            className="block text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors truncate"
          >
            {item.name}
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit Price: <span className="font-semibold text-slate-700">৳{formatPrice(item.price)}</span>
          </p>
        </div>
      </div>

      {/* Quantity & Subtotal */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Quantity Controls */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          <button
            type="button"
            onClick={handleDecrease}
            className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <input
            type="number"
            min="1"
            max={item.stock || 99}
            value={item.quantity}
            onChange={handleDirectChange}
            className="w-10 text-center text-xs font-semibold bg-white border-x border-slate-200 py-1 text-slate-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Item quantity"
          />
          <button
            type="button"
            onClick={handleIncrease}
            disabled={item.quantity >= (item.stock || 99)}
            className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[80px]">
          <p className="text-xs text-slate-400">Total</p>
          <p className="text-sm font-bold text-slate-900">
            ৳{formatPrice(item.price * item.quantity)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove item"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
