import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, Search, Phone, ShieldCheck, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SearchBar } from './SearchBar';
import { MobileMenu } from './MobileMenu';
import { siteConfig } from '../../data/site';
import logo from '../../assets/logo.png';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { getCartItemCount } = useCart();
  const { user, signOut } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const itemCount = getCartItemCount();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    const { error } = await signOut();
    if (error) {
      addToast('Failed to sign out', 'error');
    } else {
      addToast('Signed out successfully', 'success');
      navigate('/');
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account';

  const mainNav = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop Earbuds' },
    { to: '/about', label: 'About Us' },
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
                <img src={logo} alt="Gazet Logo" className="h-14 w-auto" />
              </Link>
            </div>

            {/* Middle: Desktop Search Bar */}
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <SearchBar />
            </div>

            {/* Right: Actions (Auth, Mobile Search toggle, Cart) */}
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

              {/* User Account / Sign In */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 text-slate-700 shadow-xs"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold max-w-[100px] truncate">
                      {userName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">{userName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          My Account Profile
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    to="/signin"
                    className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden sm:inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

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
