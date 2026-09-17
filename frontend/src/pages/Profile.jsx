import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, LogOut, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SEO } from '../components/common/SEO';
import { Button } from '../components/common/Button';

export const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in required</h2>
        <p className="text-slate-600 mb-6">Please sign in to view your profile and order history.</p>
        <Button onClick={() => navigate('/signin')} variant="primary" fullWidth>
          Sign In Now
        </Button>
      </div>
    );
  }

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      addToast('Failed to sign out', 'error');
    } else {
      addToast('Signed out successfully', 'success');
      navigate('/');
    }
  };

  const fullName = user.user_metadata?.full_name || 'Valued Customer';
  const phone = user.user_metadata?.phone || 'Not provided';
  const email = user.email || '';

  return (
    <>
      <SEO title="My Account | Gazet" description="Manage your Gazet profile and account settings." />

      <div className="bg-slate-50 min-h-[calc(100vh-140px)] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>
                <p className="text-sm text-slate-500">{email}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="secondary"
              size="sm"
              icon={LogOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              Sign Out
            </Button>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </span>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> {fullName}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Phone Number
                </span>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> {phone}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 md:col-span-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </span>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> {email}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/shop"
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Explore Gadgets</h3>
                  <p className="text-xs text-slate-500">Discover trending tech & accessories</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/cart"
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">View Cart</h3>
                  <p className="text-xs text-slate-500">Proceed to checkout anytime</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
