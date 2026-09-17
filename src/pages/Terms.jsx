import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />

      <div className="mt-2 mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2">
          General terms of service governing purchases and store usage.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. General Terms</h2>
          <p>
            By accessing and purchasing through Gazet, you agree to comply with our store policies, delivery guidelines, and warranty terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Products & Pricing</h2>
          <p>
            All prices listed on the website are in Bangladeshi Taka (BDT ৳). We reserve the right to revise product specifications, promotional discounts, and availability without prior notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Orders & Cash on Delivery</h2>
          <p>
            An order is considered confirmed once our team verifies the recipient's phone number and delivery location. Customers paying via Cash on Delivery agree to pay the total invoice amount upon delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Warranty Terms</h2>
          <p>
            Warranty claims cover manufacturer defects only. Physical damage, liquid exposure, or unauthorized dismantling void the standard warranty terms.
          </p>
        </section>
      </div>
    </div>
  );
};
