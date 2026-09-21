import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductPrice } from '../components/product/ProductPrice';
import { ProductSpecsTable } from '../components/product/ProductSpecsTable';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/categories';
import { sanitizeId } from '../utils/security';

export const ProductDetails = () => {
  const { products, getProduct, loading: productsLoading } = useProducts();
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Safely sanitize the parameter before looking up product
  const safeIdentifier = sanitizeId(slug || id || '');
  const product = safeIdentifier ? getProduct(safeIdentifier) : null;

  if (!product && !productsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SEO title="Product Not Found" noIndex={true} />
        <EmptyState
          title="Product Not Found"
          description="The gadget you are looking for might have been discontinued or does not exist."
          actionLabel="Browse All Gadgets"
          actionTo="/shop"
        />
      </div>
    );
  }

  if (!product && productsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categoryObj = categories.find((c) => c.slug === product.category);

  const productColors = Array.isArray(product?.colors) && product.colors.length > 0 ? product.colors : ['Black', 'White'];
  const [selectedColor, setSelectedColor] = useState(() => (productColors[0] || 'Black'));

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(product.stock || 99, prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    const directItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      brand: product.brand,
      price: product.price,
      comparePrice: product.comparePrice,
      image: product.images?.[0] || '',
      stock: product.stock,
      quantity: quantity,
      selectedColor: selectedColor,
    };
    navigate('/checkout', { state: { directBuyItem: directItem } });
  };

  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.shortDescription || product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://gazet-bd.com/product/${product.slug}`,
      "priceCurrency": "BDT",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Gazet"
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEO
        title={`${product.name} - Price in Bangladesh`}
        description={`Buy ${product.name} (${product.brand}) online at best price in Bangladesh (৳${formatPrice(product.price)}). 100% genuine with official warranty and fast Cash on Delivery.`}
        image={product.images?.[0]}
        keywords={`${product.name} price in bd, buy ${product.name}, ${product.brand} bd`}
        schema={productSchema}
      />
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Shop', to: '/shop' },
          {
            label: categoryObj?.name || product.category,
            to: `/category/${product.category}`,
          },
          { label: product.name },
        ]}
      />

      {/* Main Product Info Section */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
        {/* Left: Product Gallery */}
        <div className="md:col-span-6">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Purchase and Specs Column */}
        <div className="md:col-span-6 flex flex-col gap-6">
          <div className="space-y-3">
            {/* Brand & SKU */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-blue-600 uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">
                SKU: {product.sku}
              </span>
            </div>

            {/* Product Title (H1 for SEO) */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="pt-2">
              <ProductPrice
                price={product.price}
                comparePrice={product.comparePrice}
                discount={product.discount}
                size="lg"
              />
            </div>

            {/* Stock status indicator */}
            <div className="pt-2">
              {product.stock > 0 ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>In Stock ({product.stock} units available)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {product.shortDescription || product.description}
            </p>
          </div>

          {/* Action Area: Color, Quantity & Buttons */}
          <div className="border-t border-b border-slate-200 py-6 space-y-4">
            {/* Color Selection (if product has available colors) */}
            {productColors.length > 0 && (
              <div className="space-y-2 pb-2 border-b border-slate-100">
                <label className="text-sm font-semibold text-slate-800 flex items-center justify-between">
                  <span>Select Color:</span>
                  <span className="text-xs text-blue-600 font-bold capitalize">{selectedColor || 'Choose a color'}</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {productColors.map((colorName, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(colorName)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedColor === colorName
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {colorName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <label htmlFor="qty" className="text-sm font-semibold text-slate-800">
                  Quantity:
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className="p-2.5 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900 select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={quantity >= (product.stock || 99)}
                    className="p-2.5 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price under quantity */}
              <div className="flex items-center gap-2 text-sm text-slate-600 pt-1">
                <span className="font-medium text-slate-500">Total Price ({quantity} {quantity === 1 ? 'item' : 'items'}):</span>
                <span className="text-base font-extrabold text-blue-600">
                  ৳{formatPrice(product.price * quantity)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-slate-400">
                    (৳{formatPrice(product.price)} each)
                  </span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={ShoppingBag}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                fullWidth
              >
                Add to Cart
              </Button>

              <Button
                variant="dark"
                size="lg"
                icon={Zap}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                fullWidth
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Cash on Delivery & Trust Info Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Cash on Delivery Available</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Order now and pay in cash when the delivery person arrives at your doorstep.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>100% Genuine Product</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Official Warranty Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specifications Section */}
      <div className="mt-14 sm:mt-20 border-t border-slate-200 pt-10 sm:pt-14 space-y-12">
        {/* Full Description */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-4">
            Product Description
          </h2>
          <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-xs">
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
        </div>

        {/* Specifications Table */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-4">
            Specifications
          </h2>
          <ProductSpecsTable specifications={product.specifications} />
        </div>

        {/* Delivery Information */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-4">
            Delivery & Return Information
          </h2>
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-xs space-y-4 text-sm text-slate-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-1">Inside Dhaka</h3>
                <p>Delivery in 24 to 48 Hours. Charge: ৳70 (Cash on delivery)</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-1">Outside Dhaka (All 64 Districts)</h3>
                <p>Delivery in 2 to 4 Business Days. Charge: ৳130 (Cash on delivery)</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              * Delivery times and charges may slightly vary depending on precise courier availability and weather conditions.
            </p>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
          products={products}
        />
      </div>
    </div>
  );
};
