import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CheckCircle2, ShieldCheck, Banknote } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { siteConfig } from '../../data/site';

export const CheckoutForm = ({ deliveryCharge, onDivisionChange }) => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();

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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Clear field error on change
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    // Simulate short network request
    setTimeout(() => {
      // Generate realistic fake order ID (e.g. ORD-20260917-4821)
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const generatedOrderId = `ORD-${dateStr}-${randomDigits}`;

      const totalAmount = getCartTotal(deliveryCharge);

      // Save order details to sessionStorage for OrderSuccess page to display cleanly
      const orderDetails = {
        orderId: generatedOrderId,
        customer: formData,
        items: cartItems,
        deliveryCharge,
        total: totalAmount,
        createdAt: new Date().toISOString(),
      };

      try {
        sessionStorage.setItem(`order_${generatedOrderId}`, JSON.stringify(orderDetails));
      } catch (err) {
        console.error('Failed to store order in sessionStorage', err);
      }

      // Clear the user's cart
      clearCart();
      setIsSubmitting(false);

      // Navigate to order success screen
      navigate(`/order-success/${generatedOrderId}`);
    }, 600);
  };

  const availableDistricts = siteConfig.districtsByDivision[formData.division] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Customer & Delivery Information */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          Delivery Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Full Name */}
          <div className="sm:col-span-2">
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
          <div>
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
          <div>
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
          <div>
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
          <div>
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
          <div>
            <Input
              label="Area / Thana / Police Station"
              name="area"
              placeholder="e.g. Banani / Gulshan / Dhanmondi"
              value={formData.area}
              onChange={handleChange}
            />
          </div>

          {/* Postal Code */}
          <div>
            <Input
              label="Postal Code (Optional)"
              name="postalCode"
              placeholder="e.g. 1213"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>

          {/* Full Address */}
          <div className="sm:col-span-2">
            <div className="flex flex-col gap-1.5">
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
                className={`w-full p-3 rounded-lg border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors ${
                  errors.address ? 'border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.address && (
                <p className="text-xs text-red-600 font-medium">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Order Notes */}
          <div className="sm:col-span-2">
            <div className="flex flex-col gap-1.5">
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
                className="w-full p-3 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Payment Method (Cash on Delivery Only) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-emerald-600" />
          Payment Method
        </h2>

        <div className="relative border-2 border-blue-600 bg-blue-50/40 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer">
          <input
            type="radio"
            id="payment_cod"
            name="paymentMethod"
            value="cod"
            checked={formData.paymentMethod === 'cod'}
            readOnly
            className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
          />
          <div className="flex-1">
            <label htmlFor="payment_cod" className="font-bold text-slate-900 block text-sm sm:text-base cursor-pointer">
              Cash on Delivery (COD)
            </label>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Pay with cash when your product arrives at your address. Inspect before payment.
            </p>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800">
            Available Nationwide
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
        disabled={cartItems.length === 0}
      >
        Place Order Now (৳{new Intl.NumberFormat('en-BD').format(getCartTotal(deliveryCharge))})
      </Button>
    </form>
  );
};
