import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, Truck, CreditCard, Facebook } from 'lucide-react';
import { siteConfig } from '../../data/site';
import logo from '../../assets/logo.png';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Value props ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white text-sm font-semibold">Nationwide Delivery</h5>
              <p className="text-xs text-slate-400">Cash on Delivery across BD</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white text-sm font-semibold">100% Genuine</h5>
              <p className="text-xs text-slate-400">Authentic gadgets & warranty</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white text-sm font-semibold">Pay on Delivery</h5>
              <p className="text-xs text-slate-400">Inspect before you pay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Store info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Gazet Logo" className="h-12 w-auto filter brightness-0 invert" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted destination for genuine TWS & Active Noise Cancelling Wireless Earbuds in Bangladesh.
            </p>
            <div className="pt-2">
              <a
                href={siteConfig.socials?.facebook || 'https://www.facebook.com/friendsgazetteshop'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
              >
                <Facebook className="w-4 h-4 fill-current" />
                <span>Visit Facebook Page</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-blue-400 transition-colors">
                  Shop Earbuds
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-blue-400 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-blue-400 transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-blue-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-white transition-colors">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                <a
                  href={siteConfig.socials?.facebook || 'https://www.facebook.com/friendsgazetteshop'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-blue-400 font-semibold"
                >
                  Facebook: friendsgazetteshop
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright footer bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 {siteConfig.name}. All rights reserved.</p>
        <p className="text-slate-500">
          Designed for high-speed shopping across Bangladesh.
        </p>
      </div>
    </footer>
  );
};
