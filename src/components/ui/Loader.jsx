import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={`${sizes[size]} border-2 border-beige border-t-gold rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      />
      <p className="font-sans text-xs tracking-widest uppercase text-light-gray">Loading</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-20">{spinner}</div>;
}

// Skeleton loader for product cards
export function ProductSkeleton() {
  return (
    <div className="group">
      <div className="aspect-[3/4] skeleton mb-4" />
      <div className="skeleton h-3 w-3/4 mb-2" />
      <div className="skeleton h-3 w-1/2 mb-3" />
      <div className="skeleton h-4 w-1/3" />
    </div>
  );
}

// Generic skeleton line
export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton rounded ${className}`} />;
}