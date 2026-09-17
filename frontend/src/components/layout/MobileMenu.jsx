import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { X, Sparkles, ChevronRight, Phone, Mail, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { siteConfig } from '../../data/site';
import { categories } from '../../data/categories';
import logo from '../../assets/logo.png';

export const MobileMenu = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignOut = async () => {
    onClose();
    const { error } = await signOut();
    if (error) {
      addToast('Failed to sign out', 'error');
    } else {
      addToast('Signed out successfully', 'success');
      navigate('/');
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'My Account';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop All' },
    { to: '/categories', label: 'Categories' },
    { to: '/shop?onSale=true', label: 'Deals & Offers', badge: 'Sale' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Support' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <Link to="/" onClick={onClose} className="flex items-center gap-2">
              <img src={logo} alt="Gazet Logo" className="h-12 w-auto" />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account Section */}
          <div className="p-3 bg-slate-50 border-b border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200/80 shadow-xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/signin"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-600" /> Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Navigation items */}
          <nav className="p-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-100 text-amber-700">
                      {link.badge}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
            ))}
          </nav>

          {/* Popular Categories list */}
          <div className="px-4 py-3 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Top Categories
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="text-xs text-slate-600 hover:text-blue-600 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-blue-50/50 truncate block"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>{siteConfig.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>{siteConfig.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

