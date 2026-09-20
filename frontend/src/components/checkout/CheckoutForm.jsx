import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Banknote, Copy, Check, Info, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../../context/ToastContext';
import { siteConfig } from '../../data/site';
import { safeSessionStorage } from '../../utils/security';

export const CheckoutForm = ({ items = [], deliveryCharge = 70, onDivisionChange, isDirectBuy = false }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user, session } = useAuth();
  const { refreshProducts } = useProducts();
  const { addToast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || 'https://pranto-backend-1.onrender.com/api';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    division: 'Dhaka',
    district: 'Dhaka',
    area: '',
    address: '',
    postalCode: '',
    orderNotes: '',
    paymentMethod: 'cod',
    transactionId: '',
    codPaymentService: '',
  });

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync user profile data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.user_metadata?.full_name || '',
        phone: prev.phone || user.user_metadata?.phone || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + deliveryCharge;
  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val || 0);

  // Validate Bangladeshi Phone Number (013, 014, 015, 016, 017, 018, 019 + 8 digits)
  const validatePhone = (phone) => {
    const cleanPhone = String(phone || '').replace(/[\s-]/g, '');
    const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    return regex.test(cleanPhone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'division') {
        const districts = siteConfig.districtsByDivision[value] || [];
        updated.district = districts[0] || '';
        if (onDivisionChange) onDivisionChange(value);
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentMethodSelect = (methodKey) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: methodKey,
      // Clear transaction ID if switching to COD
      transactionId: methodKey === 'cod' ? '' : prev.transactionId,
    }));
    if (errors.paymentMethod || errors.transactionId) {
      setErrors((prev) => ({ ...prev, paymentMethod: '', transactionId: '' }));
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    addToast('Account number copied to clipboard!', 'success');
    setTimeout(() => setCopiedNumber(false), 3000);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 11-digit BD phone number (e.g. 017XXXXXXXX)';
    }

    if (!formData.division) {
      newErrors.division = 'Please select your division';
    }

    if (!formData.district) {
      newErrors.district = 'Please select your district';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Please enter your full delivery address';
    }

    // Payment Service Selector Validation for COD
    if (formData.paymentMethod === 'cod' && !formData.codPaymentService) {
      newErrors.codPaymentService = 'Please select which service (bKash, Nagad, or Rocket) you used to pay the delivery charge';
    }

    // Transaction ID Validation for all orders (including COD advance delivery charge)
    const trimmedTxn = formData.transactionId.trim();
    if (!trimmedTxn) {
      if (formData.paymentMethod === 'cod') {
        newErrors.transactionId = `Please enter the Transaction ID (TrxID) for the advance delivery charge payment (৳${formatPrice(deliveryCharge)})`;
      } else {
        newErrors.transactionId = `Please enter the Transaction ID (TrxID) for your ${siteConfig.paymentMethods[formData.paymentMethod]?.name || 'digital'} payment`;
      }
    } else if (trimmedTxn.length < 4) {
      newErrors.transactionId = 'Transaction ID must be at least 4 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      const cleanTxnId = formData.transactionId.trim();

      const payload = {
        customer: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          division: formData.division,
          district: formData.district,
          area: formData.area.trim(),
          address: formData.address.trim(),
          postalCode: formData.postalCode.trim(),
          orderNotes: formData.orderNotes.trim(),
        },
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          sku: i.sku || '',
          price: Number(i.price),
          quantity: Number(i.quantity) || 1,
          image: i.image || '',
        })),
        paymentMethod: formData.paymentMethod,
        transactionId: cleanTxnId,
        deliveryPaymentService: formData.paymentMethod === 'cod' ? formData.codPaymentService : null,
      };

      const headers = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to place order');
      }

      const orderData = result.data;
      const orderId = orderData.orderId;

      // Save order details to sessionStorage for OrderSuccess page to display cleanly
      const orderDetails = {
        orderId: orderId,
        customer: formData,
        items: items,
        deliveryCharge: orderData.deliveryCharge || deliveryCharge,
        subtotal: orderData.subtotal || subtotal,
        total: orderData.total || totalAmount,
        paymentMethod: orderData.paymentMethod || formData.paymentMethod,
        paymentStatus: orderData.paymentStatus || (formData.paymentMethod === 'cod' ? 'unpaid' : 'pending_verification'),
        transactionId: orderData.transactionId || cleanTxnId,
        createdAt: orderData.createdAt || new Date().toISOString(),
      };

      safeSessionStorage.setItem(`order_${orderId}`, JSON.stringify(orderDetails));

      // Refresh product stock in context
      if (typeof refreshProducts === 'function') {
        refreshProducts();
      }

      // Clear direct buy temporary session storage
      try {
        sessionStorage.removeItem('gazet_buy_now_item');
      } catch {
        // ignore
      }

      // If ordering the entire cart, clear the cart.
      if (!isDirectBuy) {
        clearCart();
      }

      addToast(`Order ${orderId} placed successfully!`, 'success');

      // Navigate to order success screen
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error('Order submission error:', err);
      addToast(err.message || 'Unable to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDistricts = siteConfig.districtsByDivision[formData.division] || [];
  const currentPayment = siteConfig.paymentMethods[formData.paymentMethod] || siteConfig.paymentMethods.cod;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 min-w-0 w-full">
      {/* 1. Customer & Delivery Information */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-7 shadow-xs min-w-0 w-full">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600 shrink-0" />
          <span>Delivery Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 min-w-0 w-full">
          {/* Full Name */}
          <div className="sm:col-span-2 min-w-0 w-full">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="e.g. MD. Kawser Ahmed"
              required
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
          </div>

          {/* Phone Number */}
          <div className="min-w-0 w-full">
            <Input
              label="Phone Number (11 Digits)"
              name="phone"
              type="tel"
              placeholder="017XXXXXXXX"
              required
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              helperText="For order confirmation & delivery updates"
            />
          </div>

          {/* Email Address (Optional) */}
          <div className="min-w-0 w-full">
            <Input
              label="Email Address (Optional)"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          {/* Division */}
          <div className="min-w-0 w-full">
            <Select
              label="Division"
              name="division"
              required
              options={siteConfig.divisions}
              value={formData.division}
              onChange={handleChange}
              error={errors.division}
            />
          </div>

          {/* District */}
          <div className="min-w-0 w-full">
            <Select
              label="District / City"
              name="district"
              required
              options={availableDistricts}
              value={formData.district}
              onChange={handleChange}
              error={errors.district}
            />
          </div>

          {/* Area / Thana */}
          <div className="min-w-0 w-full">
            <Input
              label="Area / Thana / Police Station"
              name="area"
              placeholder="e.g. Banani / Gulshan / Dhanmondi"
              value={formData.area}
              onChange={handleChange}
            />
          </div>

          {/* Postal Code */}
          <div className="min-w-0 w-full">
            <Input
              label="Postal Code (Optional)"
              name="postalCode"
              placeholder="e.g. 1213"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>

          {/* Full Address */}
          <div className="sm:col-span-2 min-w-0 w-full">
            <div className="flex flex-col gap-1.5 min-w-0 w-full">
              <label htmlFor="address" className="text-sm font-medium text-slate-700">
                Full Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                rows="2"
                placeholder="House number, Flat/Floor, Road name/number, Landmark..."
                required
                value={formData.address}
                onChange={handleChange}
                className={`w-full max-w-full box-border p-3 rounded-lg border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-y ${
                  errors.address ? 'border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.address && (
                <p className="text-xs text-red-600 font-medium">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Order Notes */}
          <div className="sm:col-span-2 min-w-0 w-full">
            <div className="flex flex-col gap-1.5 min-w-0 w-full">
              <label htmlFor="orderNotes" className="text-sm font-medium text-slate-700">
                Order Notes (Optional)
              </label>
              <textarea
                id="orderNotes"
                name="orderNotes"
                rows="2"
                placeholder="Special instructions for delivery (e.g. deliver after 5 PM)..."
                value={formData.orderNotes}
                onChange={handleChange}
                className="w-full max-w-full box-border p-3 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-y"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Payment Method Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-7 shadow-xs min-w-0 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Payment Method</span>
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Select 1 of 4
          </span>
        </div>

        {/* 4 Payment Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0 w-full">
          {/* COD Option */}
          <div
            onClick={() => handlePaymentMethodSelect('cod')}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between relative ${
              formData.paymentMethod === 'cod'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="pay_cod"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={() => handlePaymentMethodSelect('cod')}
                className="mt-1 w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <label htmlFor="pay_cod" className="font-bold text-slate-900 text-sm sm:text-base cursor-pointer">
                    Cash on Delivery
                  </label>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                    COD
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pay with cash when your package is delivered to your door.
                </p>
              </div>
            </div>
          </div>

          {/* bKash Option */}
          <div
            onClick={() => handlePaymentMethodSelect('bkash')}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between relative ${
              formData.paymentMethod === 'bkash'
                ? 'border-pink-600 bg-pink-50/40 shadow-xs ring-1 ring-pink-600/30'
                : 'border-slate-200 hover:border-pink-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="pay_bkash"
                name="paymentMethod"
                value="bkash"
                checked={formData.paymentMethod === 'bkash'}
                onChange={() => handlePaymentMethodSelect('bkash')}
                className="mt-1 w-4 h-4 text-pink-600 border-slate-300 focus:ring-pink-500 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <label htmlFor="pay_bkash" className="font-bold text-slate-900 text-sm sm:text-base cursor-pointer">
                    bKash
                  </label>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-pink-100 text-pink-800">
                    Send Money
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Send Money to our Personal bKash number and enter TrxID.
                </p>
              </div>
            </div>
          </div>

          {/* Nagad Option */}
          <div
            onClick={() => handlePaymentMethodSelect('nagad')}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between relative ${
              formData.paymentMethod === 'nagad'
                ? 'border-orange-500 bg-orange-50/40 shadow-xs ring-1 ring-orange-500/30'
                : 'border-slate-200 hover:border-orange-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="pay_nagad"
                name="paymentMethod"
                value="nagad"
                checked={formData.paymentMethod === 'nagad'}
                onChange={() => handlePaymentMethodSelect('nagad')}
                className="mt-1 w-4 h-4 text-orange-600 border-slate-300 focus:ring-orange-500 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <label htmlFor="pay_nagad" className="font-bold text-slate-900 text-sm sm:text-base cursor-pointer">
                    Nagad
                  </label>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-orange-100 text-orange-800">
                    Send Money
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Send Money to our Personal Nagad number and enter TxnID.
                </p>
              </div>
            </div>
          </div>

          {/* Rocket Option */}
          <div
            onClick={() => handlePaymentMethodSelect('rocket')}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between relative ${
              formData.paymentMethod === 'rocket'
                ? 'border-purple-600 bg-purple-50/40 shadow-xs ring-1 ring-purple-600/30'
                : 'border-slate-200 hover:border-purple-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="pay_rocket"
                name="paymentMethod"
                value="rocket"
                checked={formData.paymentMethod === 'rocket'}
                onChange={() => handlePaymentMethodSelect('rocket')}
                className="mt-1 w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <label htmlFor="pay_rocket" className="font-bold text-slate-900 text-sm sm:text-base cursor-pointer">
                    Rocket
                  </label>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-800">
                    Send Money
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Send Money to our Personal Rocket number and enter TxnID.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details & Instructions Box for COD (Advance Delivery Charge) or Digital (bKash / Nagad / Rocket) */}
        {formData.paymentMethod === 'cod' ? (
          <div className="mt-5 border border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white rounded-2xl p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Advance Delivery Charge Prepayment (COD)
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>Delivery Fee in Advance • Products on Delivery</span>
              </span>
            </div>

            {/* Advance Amount & Accounts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border border-emerald-100 p-3.5 sm:p-4 rounded-xl shadow-2xs">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Send Delivery Fee To (Personal)</span>
                <div className="space-y-1.5 mt-1.5 text-xs">
                  <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-pink-700">bKash:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900">{siteConfig.paymentMethods.bkash.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(siteConfig.paymentMethods.bkash.accountNumber)}
                        className="text-slate-400 hover:text-blue-600 cursor-pointer"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-orange-700">Nagad:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900">{siteConfig.paymentMethods.nagad.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(siteConfig.paymentMethods.nagad.accountNumber)}
                        className="text-slate-400 hover:text-blue-600 cursor-pointer"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <span className="font-semibold text-purple-700">Rocket:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900">{siteConfig.paymentMethods.rocket.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(siteConfig.paymentMethods.rocket.accountNumber)}
                        className="text-slate-400 hover:text-blue-600 cursor-pointer"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Delivery Charge to Send Now</span>
                  <span className="font-extrabold text-emerald-600 text-xl sm:text-2xl mt-0.5 block">
                    ৳{formatPrice(deliveryCharge)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 bg-emerald-50/70 p-2 rounded-lg mt-2">
                  Pay remaining <strong className="text-slate-900">৳{formatPrice(subtotal)}</strong> in cash to the rider on delivery.
                </div>
              </div>
            </div>

            {/* Step instructions */}
            <div className="space-y-1 text-xs text-slate-600 bg-slate-100/80 p-3 rounded-xl">
              <p className="font-bold text-slate-800 mb-0.5">Instructions:</p>
              <p>1. Send <strong>৳{formatPrice(deliveryCharge)}</strong> via <strong>Send Money</strong> to any of the numbers above.</p>
              <p>2. Select the service used below (bKash, Nagad, or Rocket).</p>
              <p>3. Copy the <strong>Transaction ID (Txn ID)</strong> from your SMS / App and paste it below.</p>
              <p>4. Your order will be placed as <strong>Pending</strong> and confirmed by our Admin team.</p>
            </div>

            {/* Payment Service Selection Dropdown */}
            <div className="pt-1">
              <label htmlFor="codPaymentService" className="block text-sm font-bold text-slate-900 mb-1.5">
                Payment Service Used <span className="text-red-500">*</span>
              </label>
              <select
                id="codPaymentService"
                name="codPaymentService"
                value={formData.codPaymentService}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors ${
                  errors.codPaymentService ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                <option value="">-- Select Service (bKash / Nagad / Rocket) --</option>
                <option value="bkash">bKash Personal</option>
                <option value="nagad">Nagad Personal</option>
                <option value="rocket">Rocket Personal</option>
              </select>
              {errors.codPaymentService && (
                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.codPaymentService}</span>
                </p>
              )}
            </div>

            {/* Transaction ID Input */}
            <div className="pt-1">
              <label htmlFor="transactionId" className="block text-sm font-bold text-slate-900 mb-1.5">
                Delivery Charge Transaction ID (Txn ID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="transactionId"
                name="transactionId"
                placeholder="e.g. 9J87AKQ62M or TrxID from SMS"
                value={formData.transactionId}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border text-sm font-mono tracking-wider text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors uppercase ${
                  errors.transactionId ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.transactionId && (
                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.transactionId}</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-5 border border-slate-200 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentPayment.themeColor || '#2563eb' }}
                />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {currentPayment.name} Payment Instructions
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>Personal Account (Manual Verification)</span>
              </span>
            </div>

            {/* Account Details & Copy Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border border-slate-200 p-3.5 sm:p-4 rounded-xl shadow-2xs">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Send Money To Number</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono font-black text-slate-900 text-base sm:text-lg tracking-wide">
                    {currentPayment.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentPayment.accountNumber)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedNumber ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Account Type: <strong className="text-slate-700">{currentPayment.accountType || 'Personal'}</strong>
                </span>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">Exact Amount to Send</span>
                <span className="font-extrabold text-blue-600 text-xl sm:text-2xl mt-0.5 block">
                  ৳{formatPrice(totalAmount)}
                </span>
                <span className="text-[11px] text-slate-400">
                  (Subtotal ৳{formatPrice(subtotal)} + Delivery ৳{formatPrice(deliveryCharge)})
                </span>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-100/70 p-3.5 rounded-xl">
              <p className="font-bold text-slate-800 text-xs mb-1">Follow these steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>Open your <strong>{currentPayment.shortName} App</strong> on your mobile phone.</li>
                <li>Choose <strong>Send Money</strong> option.</li>
                <li>Enter the Personal number: <strong className="font-mono text-slate-900">{currentPayment.accountNumber}</strong></li>
                <li>Enter the exact amount: <strong className="text-blue-600">৳{formatPrice(totalAmount)}</strong></li>
                <li>Complete the payment and copy the <strong>Transaction ID (TrxID)</strong>.</li>
                <li>Paste the Transaction ID in the box below and click <strong>Place Order</strong>.</li>
              </ol>
            </div>

            {/* Transaction ID Input Field */}
            <div className="pt-2">
              <label htmlFor="transactionId" className="block text-sm font-bold text-slate-900 mb-1.5">
                {currentPayment.shortName} Transaction ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  placeholder="e.g. 9J87AKQ62M or TrxID from SMS"
                  value={formData.transactionId}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border text-sm font-mono tracking-wider text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors uppercase ${
                    errors.transactionId ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.transactionId ? (
                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.transactionId}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">
                  Note: Your order will be placed as Pending and verified by our Admin team.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="w-full min-w-0">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={items.length === 0}
          className="w-full shadow-md hover:shadow-lg transition-all"
        >
          <span className="truncate">
            Place Order Now (৳{formatPrice(totalAmount)})
          </span>
        </Button>
      </div>
    </form>
  );
};
