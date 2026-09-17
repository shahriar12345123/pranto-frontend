import React, { useState } from 'react';

export const ProductGallery = ({ images = [], productName = 'Product' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Preview Image */}
      <div className="relative aspect-square w-full rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs flex items-center justify-center p-4">
        <img
          src={displayImages[selectedIndex]}
          alt={`${productName} view ${selectedIndex + 1}`}
          className="w-full h-full object-contain transition-all duration-300 transform"
        />
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square w-16 sm:w-20 rounded-xl bg-white border-2 overflow-hidden shrink-0 transition-all p-1 cursor-pointer ${
                selectedIndex === idx
                  ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumb ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
