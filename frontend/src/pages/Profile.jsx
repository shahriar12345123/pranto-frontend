import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SEO } from '../components/common/SEO';
import { Button } from '../components/common/Button';

export const Profile = () => {
  const { user, session, signOut, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.access_token) return;
      try {
        setLoadingData(true);

        // 1. Fetch Orders
        const ordersRes = await fetch(`${API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const ordersJson = await ordersRes.json();
        if (ordersJson.success && Array.isArray(ordersJson.data)) {
          setOrders(ordersJson.data);
        }

        // 2. Fetch Addresses
        const addrRes = await fetch(`${API_URL}/user/addresses`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const addrJson = await addrRes.json();
        if (addrJson.success && Array.isArray(addrJson.data)) {
          setAddresses(addrJson.data);
        }
      } catch (err) {
        console.warn('Error fetching user account details:', err.message);
      } finally {
        setLoadingData(false);
      }
    };

    if (user && session?.access_token) {
      fetchUserData();
    }
  }, [user, session, API_URL]);

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
  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString('en-BD', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent session';

  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val);

  return (
    <>
      <SEO title="My Account | Gazet" description="Manage your Gazet profile and view your order history." />

      <div className="bg-slate-50 min-h-[calc(100vh-140px)] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{fullName}</h1>
                <p className="text-xs sm:text-sm text-slate-500">{email}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-500" />
                  <span>Last login: {lastSignIn}</span>
                </p>
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

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">{orders.length}</p>
                <p className="text-xs text-slate-500 font-medium">Total Orders</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">{addresses.length || (phone !== 'Not provided' ? 1 : 0)}</p>
                <p className="text-xs text-slate-500 font-medium">Delivery Locations</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">Active</p>
                <p className="text-xs text-slate-500 font-medium">Account Status</p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

          {/* Order History Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" /> Order History
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>

            {loadingData ? (
              <div className="py-10 text-center text-slate-400">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  When you order earbuds with Cash on Delivery, your full order history and delivery updates will appear here.
                </p>
                <Link to="/shop" className="inline-block mt-4">
                  <Button variant="primary" size="sm">
                    Shop Earbuds
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const itemsList = Array.isArray(order.order_items) && order.order_items.length > 0
                    ? order.order_items
                    : (Array.isArray(order.items_data) ? order.items_data : []);

                  const orderDate = new Date(order.created_at).toLocaleDateString('en-BD', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={order.id}
                      className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-white hover:border-slate-300 transition-all shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">{order.id}</span>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {order.order_status || 'Pending'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Placed on {orderDate} · Payment: {order.payment_method?.toUpperCase() || 'COD'}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-400 block sm:inline mr-1">Total:</span>
                          <span className="text-sm font-extrabold text-blue-600">৳{formatPrice(order.total_amount)}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {itemsList.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-1">
                            <div className="flex items-center gap-2">
                              {item.product_image || item.image ? (
                                <img
                                  src={item.product_image || item.image}
                                  alt={item.product_name || item.name}
                                  className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                  TWS
                                </div>
                              )}
                              <span className="font-medium text-slate-800 line-clamp-1">{item.product_name || item.name}</span>
                              <span className="text-slate-400">×{item.quantity}</span>
                            </div>
                            <span className="font-bold text-slate-700 shrink-0">
                              ৳{formatPrice((item.unit_price || item.price) * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address snippet */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-xs">{order.delivery_address || order.district}, {order.division}</span>
                        </span>
                        <Link
                          to={`/order-success/${order.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/shop"
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Explore Earbuds</h3>
                  <p className="text-xs text-slate-500">Shop Hoco, Apple & UISI models</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/cart"
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group"
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
