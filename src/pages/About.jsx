import React from 'react';
import { ShieldCheck, Truck, Headphones, Sparkles, Award, Users } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { siteConfig } from '../data/site';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Breadcrumb items={[{ label: 'About Us' }]} />

      {/* Hero Section */}
      <div className="mt-2 mb-12 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
          Our Story
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About {siteConfig.name}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
          We believe good technology should be useful, accessible, and easy to understand. Our goal is to bring practical gadgets and premium accessories to customers across Bangladesh without unnecessary complexity.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">What We Believe</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every gadget you use should seamlessly enhance your productivity, creativity, and lifestyle. We curate authentic products tested for high performance and longevity.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Uncompromised Quality</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We partner with leading global consumer electronics brands like Baseus, Anker, UGREEN, and Haylou to ensure 100% genuine products with official warranty support.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
            <Truck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Customer-First Service</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            From flexible Cash on Delivery to responsive after-sales assistance and replacement support, your shopping satisfaction is our highest priority.
          </p>
        </div>
      </div>

      {/* Stats/Highlight Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-blue-400">100%</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Authentic Products</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">64</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Districts Covered</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-amber-400">7 Days</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Replacement Warranty</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-purple-400">COD</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Available Nationwide</p>
          </div>
        </div>
      </div>
    </div>
  );
};
