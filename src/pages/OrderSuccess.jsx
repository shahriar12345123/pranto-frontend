import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, ShoppingBag, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import { Button } from '../components/common/Button';

export const OrderSuccess = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (orderId) {
      try {
        const saved = sessionStorage.getItem(`order_${orderId}`);
        if (saved) {
          setOrderDetails(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to parse order details from sessionStorage', e);
      }
    }
  }, [orderId]);

  const formatPrice = (val) => new Intl.NumberFormat('en-BD').format(val || 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 ring-8 ring-emerald-50/50">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-md mx-auto">
          Thank you for shopping with Gazet. We have received your order and will contact you shortly via phone to confirm shipment.
        </p>

        {/* Order Details Card */}
        <div className="my-8 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
            <div>
              <span className="text-xs text-slate-400 font-medium">Order Number</span>
              <p className="font-mono font-bold text-slate-900 text-base sm:text-lg">
                #{orderId}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 font-medium">Payment Method</span>
              <p className="font-semibold text-emerald-700 text-sm">
                Cash on Delivery (COD)
              </p>
            </div>
          </div>

          {/* If items are stored in session, display them */}
          {orderDetails?.items && orderDetails.items.length > 0 && (
            <div className="space-y-2.5 py-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ordered Items
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 divide-y divide-slate-100">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="font-semibold text-slate-700">{item.quantity}x</span>
                      <span className="text-slate-800 truncate">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900 shrink-0">
                      ৳{formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Delivery info if present */}
          {orderDetails?.customer && (
            <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block">Deliver to:</span>
                <span className="font-semibold text-slate-800">{orderDetails.customer.fullName}</span>
                <p className="truncate">{orderDetails.customer.address}</p>
                <p>{orderDetails.customer.district}, {orderDetails.customer.division}</p>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-400 block">Contact Phone:</span>
                <span className="font-semibold text-slate-800">{orderDetails.customer.phone}</span>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Total Payable Amount</span>
            <span className="text-xl sm:text-2xl font-black text-blue-600">
              ৳{formatPrice(orderDetails?.total || 0)}
            </span>
          </div>
        </div>

        {/* Confirmation Note */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 mb-8 bg-blue-50/60 text-blue-800 p-3.5 rounded-xl">
          <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Our representative will call your phone number to verify and dispatch your package.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/shop" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" icon={ShoppingBag} fullWidth>
              Continue Shopping
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" fullWidth>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
