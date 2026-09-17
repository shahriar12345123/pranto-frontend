import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col justify-between">
      <div>
        <div className="aspect-square bg-slate-100 rounded-lg animate-pulse mb-3 sm:mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-3" />
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 text-center flex flex-col items-center">
      <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4" />
      <Skeleton className="h-5 w-28 mb-2" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
};

export const ProductPageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Skeleton className="aspect-square w-full rounded-2xl mb-4" />
          <div className="grid grid-cols-4 gap-3">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full mt-4" />
        </div>
      </div>
    </div>
  );
};
