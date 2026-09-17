import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';

export const FAQ = () => {
  const faqs = [
    {
      question: 'Do you offer Cash on Delivery?',
      answer:
        'Yes, Cash on Delivery (COD) is available across all 64 districts in Bangladesh. You can inspect the exterior package and pay in cash directly to the delivery agent upon receiving your order.',
    },
    {
      question: 'Do you deliver outside Dhaka?',
      answer:
        'Yes, we ship nationwide through trusted courier partners (Steadfast, Pathao, RedX, eCourier) to all divisions, districts, and thanas across Bangladesh.',
    },
    {
      question: 'How long does delivery take?',
      answer:
        'Orders inside Dhaka city are usually delivered within 24 to 48 hours. Orders outside Dhaka take approximately 2 to 4 business days depending on location.',
    },
    {
      question: 'Can I return or replace a product if it has defects?',
      answer:
        'Yes, we offer a 7-day hassle-free replacement warranty for manufacturing defects. Please contact our support team within 7 days of receiving the item with unboxing footage/photos.',
    },
    {
      question: 'Are all your products 100% original and authentic?',
      answer:
        'Every product listed on Gazet is 100% genuine and sourced directly from official brand distributors with valid serial numbers and official warranty coverage.',
    },
    {
      question: 'How can I contact customer support?',
      answer:
        'You can reach our customer support team directly by calling our hotline or emailing us at our support address. We are active daily from 10:00 AM to 10:00 PM.',
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEO
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions about Cash on Delivery, delivery timelines across Bangladesh, product warranty, and return policies at Gazet."
        keywords="gazet faq, cash on delivery bangladesh faq, gadget delivery time dhaka"
        schema={faqSchema}
      />
      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <div className="mt-2 mb-10 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Everything you need to know about purchasing, shipping, warranty, and Cash on Delivery.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
