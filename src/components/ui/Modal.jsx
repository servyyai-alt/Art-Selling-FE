import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed inset-0 flex items-center justify-center z-50 p-4`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`bg-cream w-full ${sizes[size]} max-h-[90vh] overflow-y-auto shadow-luxury`}>
              {title && (
                <div className="flex items-center justify-between px-8 py-6 border-b border-beige">
                  <h3 className="font-display text-xl font-light">{title}</h3>
                  <button onClick={onClose} className="text-light-gray hover:text-black transition-colors">
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="p-8">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}