import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Banknote } from 'lucide-react';
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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  });

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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + deliveryCharge;

  // Validate Bangladeshi Phone Number (013, 014, 015, 016, 017, 018, 019 + 8 digits)
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s-]/g, '');
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

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 11-digit BD phone number (e.g. 01700000000)';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      const payload = {
        customer: formData,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          sku: i.sku || '',
          price: Number(i.price),
          quantity: Number(i.quantity) || 1,
          image: i.image || '',
        })),
        deliveryCharge,
        total: totalAmount,
        paymentMethod: formData.paymentMethod || 'cod',
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
        deliveryCharge,
        total: totalAmount,
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

      // If ordering the entire cart, clear the cart. If ordering a single item directly, keep the cart intact.
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
                placeholder="Special notes for delivery (e.g. deliver after 5 PM)..."
                value={formData.orderNotes}
                onChange={handleChange}
                className="w-full max-w-full box-border p-3 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-y"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Payment Method (Cash on Delivery Only) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-7 shadow-xs min-w-0 w-full">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Payment Method</span>
        </h2>

        <div className="relative border-2 border-blue-600 bg-blue-50/40 rounded-xl p-3.5 sm:p-5 flex items-start gap-3 cursor-pointer min-w-0 w-full">
          <input
            type="radio"
            id="payment_cod"
            name="paymentMethod"
            value="cod"
            checked={formData.paymentMethod === 'cod'}
            readOnly
            className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <label htmlFor="payment_cod" className="font-bold text-slate-900 block text-sm sm:text-base cursor-pointer leading-snug">
              Cash on Delivery (COD)
            </label>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed break-words">
              Pay with cash when your product arrives at your address. Inspect before payment.
            </p>
          </div>
          <span className="hidden md:inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800 shrink-0">
            Nationwide
          </span>
        </div>
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
            Place Order Now (৳{new Intl.NumberFormat('en-BD').format(totalAmount)})
          </span>
        </Button>
      </div>
    </form>
  );
};
