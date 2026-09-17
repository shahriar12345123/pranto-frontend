import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Breadcrumb items={[{ label: 'Shipping Policy' }]} />

      <div className="mt-2 mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Learn how we dispatch and deliver orders across all divisions and districts in Bangladesh.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            1. Delivery Coverage Areas
          </h2>
          <p>
            We deliver to all 64 districts in Bangladesh including metropolitan areas, suburban municipalities, and union-level locations serviced by registered logistics couriers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            2. Estimated Delivery Time
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Inside Dhaka City:</strong> 24 to 48 Hours</li>
            <li><strong>Dhaka Suburbs & Surrounding Districts:</strong> 2 to 3 Business Days</li>
            <li><strong>Outside Dhaka (Nationwide):</strong> 2 to 4 Business Days</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            3. Delivery Charges
          </h2>
          <p>
            Our delivery charges are transparent and calculated based on destination:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Inside Dhaka</span>
              <span className="text-blue-600 font-extrabold text-base">৳60</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Outside Dhaka (All 64 Districts)</span>
              <span className="text-blue-600 font-extrabold text-base">৳120</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            4. Order Processing & Verification
          </h2>
          <p>
            Once you place an order with Cash on Delivery, our support representative will contact you via phone within business hours to confirm your shipping details and dispatch your package immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Delays and Unforeseen Circumstances</h2>
          <p>
            In rare instances, delivery timelines may experience minor delays due to extreme weather conditions, courier strikes, or national holidays. We keep you notified at every step.
          </p>
        </section>
      </div>
    </div>
  );
};
