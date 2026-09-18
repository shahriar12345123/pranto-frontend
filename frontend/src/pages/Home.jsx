import React, { useState, useEffect, useCallback } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';
import { CategoryGrid } from '../components/category/CategoryGrid';
import { ProductGrid } from '../components/product/ProductGrid';
import { categories } from '../data/categories';
import { siteConfig } from '../data/site';
import { useToast } from '../context/ToastContext';
import { useProducts } from '../context/ProductContext';

export const Home = () => {
  const { addToast } = useToast();
  const { products } = useProducts();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  // Index into the extended slides array (0 … n-1 are real, n is clone of 0)
  const [trackIndex, setTrackIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const timerRef = React.useRef(null);

  // 3 Hero Banners for Earbuds
  const heroBanners = [
    {
      id: 1,
      tag: "Official 7 Days Warranty",
      tagIcon: Zap,
      tagColor: "bg-blue-50 border-blue-200/80 text-blue-700",
      title: "Hoco WQ34plus.",
      titleHighlight: "Only ৳790.",
      highlightColor: "text-blue-600",
      description: "Experience premium TWS sound with the Hoco WQ34plus. Featuring 7 days warranty, 3 days replacement guarantee, 250 pcs in stock, and nationwide Cash on Delivery.",
      cta1Text: "Buy Now - ৳790",
      cta1Link: "/product/hoco-wq34plus",
      cta2Text: "Shop Earbuds",
      cta2Link: "/shop",
      image: "https://pub-844c0557c33f43fb8bc62d1b17aa1e96.r2.dev/products/prod-001/image-1.jpg",
      imageAlt: "Hoco WQ34plus Wireless Earbuds",
      badgeTitle: "7 Days Warranty",
      badgeSubtitle: "3 Days Replacement",
      badgeIcon: ShieldCheck,
      badgeIconColor: "bg-emerald-50 text-emerald-600",
      floatingStockText: "250 In Stock",
      bgGradient: "from-slate-100/90 via-white to-blue-50/50",
      visualBg: "from-blue-600/10 via-slate-100 to-indigo-50",
    },
    {
      id: 2,
      tag: "Black & White Available",
      tagIcon: Sparkles,
      tagColor: "bg-indigo-50 border-indigo-200/80 text-indigo-700",
      title: "Apple 2nd Gen.",
      titleHighlight: "Special ৳550.",
      highlightColor: "text-indigo-600",
      description: "Iconic semi-in-ear true wireless earbuds with effortless touch controls, crystal-clear audio, and 200 pcs available in Black and White colors.",
      cta1Text: "Buy Now - ৳550",
      cta1Link: "/product/apple-2nd-generation-earbuds",
      cta2Text: "View Earbuds",
      cta2Link: "/shop",
      image: "https://pub-844c0557c33f43fb8bc62d1b17aa1e96.r2.dev/products/prod-002/image-1.jpg",
      imageAlt: "Apple 2nd Generation Wireless Earbuds",
      badgeTitle: "Dual Colors",
      badgeSubtitle: "Black / White",
      badgeIcon: Sparkles,
      badgeIconColor: "bg-indigo-50 text-indigo-600",
      floatingStockText: "200 In Stock",
      bgGradient: "from-indigo-50/70 via-white to-slate-50",
      visualBg: "from-indigo-600/10 via-slate-100 to-purple-50",
    },
    {
      id: 3,
      tag: "3 Months Warranty & Guarantee",
      tagIcon: Zap,
      tagColor: "bg-emerald-50 border-emerald-200/80 text-emerald-700",
      title: "UISI Neckband.",
      titleHighlight: "Only ৳899.",
      highlightColor: "text-emerald-600",
      description: "Ultra-flexible sport wireless neckband with magnetic earbuds, deep bass tuning, 3 months warranty, 3 months guarantee, 7 days replacement, and 120 pcs stock.",
      cta1Text: "Buy Now - ৳899",
      cta1Link: "/product/uisi-neckband",
      cta2Text: "Explore Shop",
      cta2Link: "/shop",
      image: "https://pub-844c0557c33f43fb8bc62d1b17aa1e96.r2.dev/products/prod-003/image-1.jpg",
      imageAlt: "UISI Bluetooth Neckband",
      badgeTitle: "3 Months Warranty",
      badgeSubtitle: "7 Days Replacement",
      badgeIcon: ShieldCheck,
      badgeIconColor: "bg-emerald-50 text-emerald-600",
      floatingStockText: "120 In Stock",
      bgGradient: "from-emerald-50/60 via-white to-slate-50",
      visualBg: "from-emerald-600/10 via-slate-100 to-teal-50",
    },
  ];

  const n = heroBanners.length;
  // Real slide index (0-based, wraps)
  const currentSlide = trackIndex >= n ? 0 : trackIndex;

  // Advance one step (with animation)
  const advance = useCallback(() => {
    setIsAnimating(true);
    setTrackIndex((prev) => prev + 1);
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    timerRef.current = setInterval(advance, 3000);
    return () => clearInterval(timerRef.current);
  }, [advance]);

  // When we land on the clone (index n), instantly reset to index 0
  useEffect(() => {
    if (trackIndex === n) {
      const id = setTimeout(() => {
        setIsAnimating(false);
        setTrackIndex(0);
      }, 700); // match transition duration
      return () => clearTimeout(id);
    }
  }, [trackIndex, n]);

  const handleNextSlide = useCallback(() => {
    setIsAnimating(true);
    setTrackIndex((prev) => prev + 1);
  }, []);

  // Prev: go forward (n-1) steps so the "previous" slide arrives from the right
  const handlePrevSlide = useCallback(() => {
    setIsAnimating(true);
    setTrackIndex((prev) => prev + (n - 1));
  }, [n]);

  // Dot click: advance forward the minimum steps needed to reach target
  const handleDotClick = useCallback((targetIndex) => {
    setIsAnimating(true);
    setTrackIndex((prev) => {
      const realPrev = prev >= n ? 0 : prev;
      if (targetIndex === realPrev) return prev;
      // Always step forward; if target is behind current, go the long way
      const steps = (targetIndex - realPrev + n) % n;
      return prev + steps;
    });
  }, [n]);

  // Featured & Best Sellers from mock data
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const bestSellers = products.filter((p) => p.bestSelling).slice(0, 8);

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://gazet-bd.com/#organization",
        "name": "Gazet",
        "url": "https://gazet-bd.com",
        "logo": "https://gazet-bd.com/favicon.svg",
        "description": "Premium smart gadgets and electronics store in Bangladesh.",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+8801700000000",
          "contactType": "Customer Support",
          "areaServed": "BD"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://gazet-bd.com/#website",
        "url": "https://gazet-bd.com",
        "name": "Gazet Bangladesh",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://gazet-bd.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

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
      <SEO
        title="Buy Smart Gadgets & Electronics Online in Bangladesh"
        description="Discover genuine wireless earbuds, smartwatches, power banks, 65W/100W chargers, and accessories with Cash on Delivery across Bangladesh."
        keywords="smart gadgets bd, earbuds bangladesh, smartwatch price in bd, fast chargers, gazet"
        schema={homeSchema}
      />
      {/* 1. HERO SECTION WITH 3 AUTO-SLIDING BANNERS (3s INTERVAL) */}
      <section
        className="relative overflow-hidden border-b border-slate-200/60"
        aria-label="Hero Carousel"
      >
        {/* Sliding Track — extended with a clone of slide[0] at the end for seamless loop */}
        <div
          className="flex w-full"
          style={{
            transform: `translateX(-${trackIndex * 100}%)`,
            transition: isAnimating ? 'transform 700ms cubic-bezier(0.25,1,0.5,1)' : 'none',
          }}
        >
          {[...heroBanners, heroBanners[0]].map((banner, index) => {
            const TagIcon = banner.tagIcon;
            const BadgeIcon = banner.badgeIcon;

            return (
              <div
                key={index}
                className={`w-full flex-shrink-0 relative overflow-hidden bg-gradient-to-b ${banner.bgGradient} py-6 sm:py-8 md:py-10 lg:py-14`}
              >
                {/* Subtle Decorative Background Blurs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-100/30 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 -mb-24 w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-indigo-100/20 blur-2xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="md:col-span-7 flex flex-col items-start text-left space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                      <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-[11px] sm:text-xs md:text-sm font-semibold shadow-2xs ${banner.tagColor}`}>
                        <TagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{banner.tag}</span>
                      </div>

                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-[1.15]">
                        {banner.title}<br />
                        <span className={banner.highlightColor}>{banner.titleHighlight}</span>
                      </h1>

                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 max-w-xl leading-relaxed">
                        {banner.description}
                      </p>

                      <div className="flex flex-row items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2 w-full sm:w-auto">
                        <Link to={banner.cta1Link} className="flex-1 sm:flex-none">
                          <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" fullWidth className="sm:w-auto">
                            {banner.cta1Text}
                          </Button>
                        </Link>
                        <Link to={banner.cta2Link} className="flex-1 sm:flex-none">
                          <Button variant="secondary" size="md" fullWidth className="sm:w-auto">
                            {banner.cta2Text}
                          </Button>
                        </Link>
                      </div>

                      {/* Highlights badge row */}
                      <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] sm:text-xs md:text-sm font-medium text-slate-500 border-t border-slate-200/60 w-full">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                          <span>Cash on Delivery</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                          <span>100% Genuine</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                          <span>Fast 64-District Shipping</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Focal Product Visual */}
                    <div className="md:col-span-5 relative flex items-center justify-center mt-3 md:mt-0">
                      <div className={`relative w-full max-w-[190px] sm:max-w-[240px] md:max-w-md aspect-square bg-gradient-to-tr ${banner.visualBg} rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-8 border border-slate-200/90 shadow-lg flex items-center justify-center group`}>
                        <img
                          src={banner.image}
                          alt={banner.imageAlt}
                          className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Floating highlight badge */}
                        <div className="absolute -bottom-2 -left-2 sm:bottom-3 sm:-left-3 bg-white/95 backdrop-blur-md border border-slate-200 p-1.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-md flex items-center gap-2 scale-80 sm:scale-95 md:scale-100 origin-bottom-left">
                          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl ${banner.badgeIconColor} flex items-center justify-center font-bold`}>
                            <BadgeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs font-bold text-slate-900 leading-tight">{banner.badgeTitle}</p>
                            <p className="text-[9px] sm:text-[11px] text-slate-500 leading-tight">{banner.badgeSubtitle}</p>
                          </div>
                        </div>

                        {/* Stock indicator badge */}
                        <div className="absolute -top-2 -right-2 sm:top-3 sm:-right-3 bg-white/95 backdrop-blur-md border border-slate-200 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-md flex items-center gap-1.5 scale-80 sm:scale-95 md:scale-100 origin-top-right">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[10px] sm:text-xs font-bold text-slate-800">{banner.floatingStockText}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Navigation Arrow Buttons (both always animate right-to-left) */}
        <button
          type="button"
          onClick={handlePrevSlide}
          aria-label="Previous Slide"
          className="absolute left-1.5 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 shadow-md backdrop-blur-md border border-slate-200 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          aria-label="Next Slide"
          className="absolute right-1.5 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 shadow-md backdrop-blur-md border border-slate-200 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>

        {/* Carousel Indicators / Pagination Dots */}
        <div className="absolute bottom-2.5 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/40 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/20">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === index
                  ? 'w-6 sm:w-7 h-2 sm:h-2.5 bg-white shadow-xs'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
              Handpicked Audio
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Earbuds
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-0.5 sm:mt-1">
              Top performing wireless earbuds selected by our audio team.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl p-6 sm:p-10 lg:p-14">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            <div className="md:col-span-8 space-y-3 sm:space-y-4">
              <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                100% Genuine Audio Store
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Upgrade Your Wireless Sound
              </h2>
              <p className="text-xs sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Experience high-definition wireless sound, crystal-clear 6-mic ENC calls, and low latency mobile gaming with official brand warranty and nationwide Cash on Delivery across Bangladesh.
              </p>
              <div className="pt-1 sm:pt-2">
                <Link to="/shop">
                  <Button variant="primary" size="md" className="sm:size-lg" icon={ArrowRight} iconPosition="right">
                    Shop Earbuds Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 flex items-center justify-center">
              <div className="relative aspect-square w-48 sm:w-60 md:w-64 lg:w-72 bg-slate-800/80 rounded-2xl p-4 sm:p-6 border border-slate-700 flex items-center justify-center">
                <img
                  src="https://pub-844c0557c33f43fb8bc62d1b17aa1e96.r2.dev/products/prod-001/image-1.jpg"
                  alt="Hoco WQ34plus Wireless Earbuds"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
              Customer Favorites
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-0.5 sm:mt-1">
              Most requested tech gadgets across Bangladesh this week.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <ProductGrid products={bestSellers} />
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
            Our Promise
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Shop With Us?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-0.5 sm:mt-1">
            Built for reliability, speed, and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {siteConfig.whyChooseUs.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col items-start"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 sm:mb-4 shadow-2xs">
                {getWhyIcon(item.icon)}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CASH ON DELIVERY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl sm:rounded-3xl bg-emerald-50/80 border border-emerald-200/80 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Banknote className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">
                Shop Now. Pay When It Arrives.
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-0.5 sm:mt-1">
                Enjoy convenient Cash on Delivery across all 64 districts in Bangladesh. Check your product before paying.
              </p>
            </div>
          </div>
          <Link to="/shop" className="shrink-0 w-full md:w-auto">
            <Button variant="success" size="md" className="sm:size-lg" fullWidth>
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>

      {/* 8. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 sm:pb-8">
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center max-w-3xl mx-auto shadow-xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Stay Updated</h3>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-1 mb-5 sm:mb-6 max-w-md mx-auto">
            Get new product updates, gadget releases, and exclusive seasonal offers directly to your inbox.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 max-w-md mx-auto"
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
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2.5 sm:mt-3">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
};
