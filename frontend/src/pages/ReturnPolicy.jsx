import React from 'react';
import { RotateCcw, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';

export const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEO
        title="Return & Replacement Policy"
        description="Review Gazet's hassle-free replacement warranty, return procedure, defect inspection criteria, and refund terms in Bangladesh."
        keywords="gazet return policy, gadget replacement warranty bd, return defective electronics bangladesh"
      />
      <Breadcrumb items={[{ label: 'Return & Refund Policy' }]} />

      <div className="mt-2 mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Return & Replacement Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Clear guidelines on product returns, replacements, and warranty claims.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-600" />
            1. Return Eligibility
          </h2>
          <p>
            Products are eligible for return or replacement upon delivery if they arrive defective, physically damaged, or if the wrong item was dispatched.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            2. Damaged or Defective Items
          </h2>
          <p>
            If your gadget is damaged upon arrival, please record an unboxing video and notify our customer helpline within 24 hours of package acceptance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            3. Return Process
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Contact customer support via phone or email with your Order ID and photos/videos of the issue.</li>
            <li>Our team will inspect the claim and arrange a courier pickup or return address.</li>
            <li>Once received and inspected at our quality assurance hub, a replacement unit is dispatched within 48 hours.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-purple-600" />
            4. Replacement or Refund
          </h2>
          <p>
            If an identical replacement item is unavailable due to stock depletion, we will offer an equivalent replacement or full refund according to your preference.
          </p>
        </section>
      </div>
    </div>
  );
};
