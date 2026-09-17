import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Banknote,
  Truck,
  Headphones,
  Sparkles,
  Zap,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { CategoryGrid } from '../components/category/CategoryGrid';
import { ProductGrid } from '../components/product/ProductGrid';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { siteConfig } from '../data/site';
import { useToast } from '../context/ToastContext';

export const Home = () => {
  const { addToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Featured & Best Sellers from mock data
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const bestSellers = products.filter((p) => p.bestSelling).slice(0, 8);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    addToast('Thanks for subscribing to Gazet updates!', 'success');
    setNewsletterEmail('');
  };

  const getWhyIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-blue-600" />;
      case 'Banknote':
        return <Banknote className="w-6 h-6 text-emerald-600" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-indigo-600" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-amber-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-100/80 via-white to-slate-50 pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-200/60">
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-24 w-80 h-80 rounded-full bg-indigo-100/30 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold shadow-2xs">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Top Rated Gadgets in Bangladesh</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Smart Gadgets.<br />
                <span className="text-blue-600">Better Everyday.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Discover useful gadgets and accessories designed to make your everyday life easier. Premium audio, wearables, chargers, and tech essentials with Cash on Delivery nationwide.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
                <Link to="/shop" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" fullWidth>
                    Shop Now
                  </Button>
                </Link>
                <Link to="/categories" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" fullWidth>
                    Explore Categories
                  </Button>
                </Link>
              </div>

              {/* Highlights badge row */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-500 border-t border-slate-200/60 w-full">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fast 64-District Shipping</span>
                </div>
              </div>
            </div>

            {/* Right Focal Product Visual */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-blue-600/10 via-slate-100 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg flex items-center justify-center group">
                <img
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
                  alt="Premium Wireless Earbuds"
                  className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                />

                {/* Floating highlight badge */}
                <div className="absolute -bottom-3 -left-3 sm:bottom-4 sm:-left-4 bg-white/95 backdrop-blur-md border border-slate-200 p-3 sm:p-3.5 rounded-2xl shadow-md flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Verified Quality</p>
                    <p className="text-[11px] text-slate-500">Official Brand Warranty</p>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 sm:top-4 sm:-right-4 bg-white/95 backdrop-blur-md border border-slate-200 px-3.5 py-2 rounded-2xl shadow-md flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-800">In Stock Ready to Ship</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
              Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Find the right gadget for every need.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <CategoryGrid categories={categories} variant="showcase" limit={8} />
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
              Handpicked
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Our handpicked gadgets for you.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Explore Full Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl p-8 sm:p-12 lg:p-16">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                Limited Time Deals
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Upgrade Your Setup
              </h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Get the gadgets you actually need, without paying more than you should. High-speed multi-port GaN chargers, ergonomic accessories, and studio headphones on special offer.
              </p>
              <div className="pt-2">
                <Link to="/shop?onSale=true">
                  <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                    Explore Deals
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="relative aspect-square w-64 sm:w-72 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="Sony Headphones Special Deal"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
              Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Best Sellers
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Most requested tech gadgets across Bangladesh this week.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={bestSellers} />
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
            Our Promise
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Shop With Us?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Built for reliability, speed, and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.whyChooseUs.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 shadow-2xs">
                {getWhyIcon(item.icon)}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CASH ON DELIVERY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-emerald-50/80 border border-emerald-200/80 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Banknote className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Shop Now. Pay When It Arrives.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Enjoy convenient Cash on Delivery across all 64 districts in Bangladesh. Check your product before paying.
              </p>
            </div>
          </div>
          <Link to="/shop" className="shrink-0 w-full md:w-auto">
            <Button variant="success" size="lg" fullWidth>
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>

      {/* 8. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Stay Updated</h3>
          <p className="text-sm sm:text-base text-slate-500 mt-1.5 mb-6 max-w-md mx-auto">
            Get new product updates, gadget releases, and exclusive seasonal offers directly to your inbox.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <Button type="submit" variant="primary" size="md" className="shrink-0 w-full sm:w-auto">
              Subscribe
            </Button>
          </form>
          <p className="text-[11px] text-slate-400 mt-3">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
};
