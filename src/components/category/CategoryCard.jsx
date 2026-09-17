import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category, variant = 'default' }) => {
  if (!category) return null;

  const isShowcase = variant === 'showcase';

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative bg-white border border-slate-200/90 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex flex-col items-center text-center">
        {/* Category Image */}
        <div className="relative aspect-square w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-50 p-2 mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-200 ring-4 ring-slate-100/80 group-hover:ring-blue-100">
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Name & Count */}
        <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        {category.description && !isShowcase && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
        <span>Explore</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
