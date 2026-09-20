import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <SEO title="Page Not Found (404)" noIndex={true} />
      <div className="text-center max-w-md">
        <p className="text-6xl sm:text-7xl font-black text-blue-600 tracking-tight">404</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2 mb-8 leading-relaxed">
          The page you are looking for doesn't exist, was moved, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="primary" size="md" icon={Home} fullWidth>
              Back to Home
            </Button>
          </Link>
          <Link to="/shop" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" icon={ArrowLeft} fullWidth>
              Browse Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
