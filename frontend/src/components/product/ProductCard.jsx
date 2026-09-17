import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ProductPrice } from './ProductPrice';
import { ProductRating } from './ProductRating';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity } = useCart();

  if (!product) return null;

  const cartItem = cartItems.find((item) => item.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const directItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      brand: product.brand,
      price: product.price,
      comparePrice: product.comparePrice,
      image: product.images?.[0] || mainImage,
      stock: product.stock,
      quantity: inCartQty > 0 ? inCartQty : 1,
    };
    navigate('/checkout', { state: { directBuyItem: directItem } });
  };

  const handleDecreaseQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, inCartQty - 1);
  };

  const handleIncreaseQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCartQty < (product.stock || 99)) {
      updateQuantity(product.id, inCartQty + 1);
    }
  };

  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val);

  const discountPercent =
    product.discount ||
    (product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null);

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="group relative bg-white border border-slate-200/80 hover:border-blue-500/40 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-250 ease-out flex flex-col justify-between h-full">
      {/* Product Image and Badges */}
      <Link to={`/product/${product.slug}`} className="block relative bg-slate-50/70 overflow-hidden">
        <div className="aspect-square w-full flex items-center justify-center p-3.5 sm:p-5 bg-gradient-to-b from-slate-50/50 to-slate-100/50">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        </div>

        {/* Badges Container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <span className="px-2 py-0.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-red-600 text-white rounded-lg shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-blue-600 text-white rounded-lg shadow-sm">
              Popular
            </span>
          )}
        </div>

        {/* Stock Badge if low */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100/90 backdrop-blur-md text-amber-800 rounded-md border border-amber-200">
              Only {product.stock} left
            </span>
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          {/* Brand or Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span className="truncate max-w-[100px]">{product.brand || product.category}</span>
            <ProductRating rating={product.rating} reviewCount={product.reviewCount} showCount={false} />
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-bold text-slate-900 text-xs sm:text-sm hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-2.5">
          <ProductPrice price={product.price} comparePrice={product.comparePrice} />

          {inCartQty > 0 ? (
            /* When added to cart: show quantity selector and calculated subtotal price */
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-blue-50/90 border border-blue-200/80 rounded-xl p-1">
                <button
                  type="button"
                  onClick={handleDecreaseQty}
                  className="p-1.5 hover:bg-blue-200/80 text-blue-700 rounded-lg transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="text-center px-1">
                  <span className="text-xs font-bold text-blue-900">
                    {inCartQty} in Cart
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleIncreaseQty}
                  disabled={inCartQty >= (product.stock || 99)}
                  className="p-1.5 hover:bg-blue-200/80 text-blue-700 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Price under quantity */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-slate-500 font-medium">Subtotal:</span>
                <span className="font-bold text-blue-600">
                  ৳{formatPrice(product.price * inCartQty)}
                </span>
              </div>

              {/* Buy Now button to go directly to checkout */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.98] shadow-xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Buy Now</span>
              </button>
            </div>
          ) : (
            /* When not in cart: Add to Cart & Buy Now buttons */
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="min-h-[38px] px-2 py-1.5 rounded-xl border border-blue-600/30 bg-blue-50/60 hover:bg-blue-600 hover:border-blue-600 text-blue-700 hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-all duration-150 active:scale-[0.98] disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{product.stock === 0 ? 'Out' : 'Add'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="min-h-[38px] px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all duration-150 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span className="truncate">Buy Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
