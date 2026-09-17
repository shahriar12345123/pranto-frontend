import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShoppingBag, Search, Phone, ShieldCheck, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { SearchBar } from './SearchBar';
import { MobileMenu } from './MobileMenu';
import { siteConfig } from '../../data/site';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  const mainNav = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/categories', label: 'Categories' },
    { to: '/shop?onSale=true', label: 'Deals' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        {/* Top Announcement Bar */}
        <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Authentic Products
              </span>
              <span className="hidden md:inline text-slate-500">|</span>
              <span className="hidden md:inline text-slate-300">
                Cash on Delivery Available Across Bangladesh
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-blue-400" />
                <span className="hidden sm:inline">{siteConfig.phone}</span>
              </a>
              <Link to="/faq" className="hover:text-white transition-colors">
                Help & FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Left: Mobile Menu Button & Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="flex items-center gap-2 shrink-0 group">
                <div className="w-9 h-9 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center font-extrabold text-xl shadow-sm transition-all duration-200 group-hover:scale-105">
                  G
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                    Gazet<span className="text-blue-600">.</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase hidden sm:block">
                    Smart Gadgets
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Search Bar */}
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <SearchBar />
            </div>

            {/* Right: Actions (Mobile Search toggle, Cart) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile search button */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle search"
              >
                {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="flex items-center gap-2.5 p-2 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 group shadow-xs"
                aria-label={`Cart with ${itemCount} items`}
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  Cart
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Collapsible Search Bar */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-3 pt-1 border-t border-slate-100">
              <SearchBar onSearchSubmit={() => setMobileSearchOpen(false)} autoFocus />
            </div>
          )}

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-between border-t border-slate-100 py-2.5 text-sm">
            <nav className="flex items-center gap-8 font-medium">
              {mainNav.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `py-1 relative transition-colors ${
                      isActive
                        ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full'
                        : 'text-slate-600 hover:text-blue-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Fast Shipping in Dhaka & All Districts
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
