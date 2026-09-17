import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

      <div className="mt-2 mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2">
          How we collect, protect, and handle your customer information.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            When you place an order on Gazet, we collect your name, phone number, delivery address, and optional email address strictly for fulfilling your order and dispatching courier delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To process and deliver your gadget purchases.</li>
            <li>To verify Cash on Delivery orders via phone call or SMS.</li>
            <li>To provide warranty assistance and customer support.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Data Protection & Security</h2>
          <p>
            We implement strict standard security protocols to safeguard your personal delivery details. We never sell, lease, or distribute your phone numbers or addresses to unauthorized third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Third Parties</h2>
          <p>
            We share only necessary delivery details (name, phone number, address) with our licensed courier partners for successful parcel delivery to your address.
          </p>
        </section>
      </div>
    </div>
  );
};
