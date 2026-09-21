import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { siteConfig } from '../data/site';
import { useToast } from '../context/ToastContext';

export const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.email.trim() || !formData.email.includes('@'))
      newErrors.email = 'Please enter a valid email address';
    if (!formData.message.trim()) newErrors.message = 'Please write your message';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Thank you! Your message has been sent. We will respond soon.', 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 500);
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Gazet",
      "telephone": siteConfig.phone || "+880 1700-000000",
      "email": siteConfig.email || "support@gazet-bd.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhaka",
        "addressCountry": "BD"
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEO
        title="Contact Us"
        description="Get in touch with the Gazet customer support team. Reach us for product inquiries, order tracking, and warranty support in Bangladesh."
        keywords="contact gazet, customer support gazet, gadget shop contact dhaka"
        schema={contactSchema}
      />
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      <div className="mt-2 mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Have questions about an order, warranty, or product specifications? Our team is always ready to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Customer Support</h2>
            <p className="text-sm text-slate-300">
              Reach out to us via phone or email during business hours for quick assistance.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800 text-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Office Address</p>
                <p className="text-slate-200 mt-0.5">{siteConfig.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Direct Hotline</p>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-slate-200 hover:text-white font-medium block mt-0.5"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Email Support</p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-slate-200 hover:text-white font-medium block mt-0.5"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Operating Hours</p>
                <p className="text-slate-200 mt-0.5">Everyday: 10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                name="name"
                placeholder="MD. Rahim"
                required
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            <Input
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              placeholder="017XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-slate-700">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                placeholder="How can we help you today?"
                value={formData.message}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${errors.message ? 'border-red-500' : 'border-slate-200'
                  }`}
              />
              {errors.message && (
                <p className="text-xs text-red-600 font-medium">{errors.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Send}
              loading={loading}
              fullWidth
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
