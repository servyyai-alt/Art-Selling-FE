// Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

export function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-sans font-medium tracking-widest uppercase transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-black text-cream hover:bg-gold hover:text-black',
    outline: 'border border-black text-black hover:bg-black hover:text-cream',
    gold: 'bg-gold text-black hover:bg-gold-dark',
    ghost: 'text-black hover:text-gold',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'text-xs px-5 py-2.5',
    md: 'text-xs px-8 py-4',
    lg: 'text-sm px-10 py-5',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </motion.button>
  );
}

// Input.jsx
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-sans text-xs tracking-widest uppercase text-mid-gray mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full border ${error ? 'border-red-500' : 'border-beige'} bg-transparent px-4 py-3 font-sans text-sm
          focus:outline-none focus:border-gold transition-colors placeholder-light-gray ${className}`}
        {...props}
      />
      {error && <p className="mt-1 font-sans text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Select.jsx
export function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-sans text-xs tracking-widest uppercase text-mid-gray mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full border ${error ? 'border-red-500' : 'border-beige'} bg-cream px-4 py-3 font-sans text-sm
          focus:outline-none focus:border-gold transition-colors appearance-none ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 font-sans text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Textarea.jsx
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-sans text-xs tracking-widest uppercase text-mid-gray mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full border ${error ? 'border-red-500' : 'border-beige'} bg-transparent px-4 py-3 font-sans text-sm
          focus:outline-none focus:border-gold transition-colors placeholder-light-gray resize-none ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 font-sans text-xs text-red-500">{error}</p>}
    </div>
  );
}