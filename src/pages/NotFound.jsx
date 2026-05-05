import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ARTTLogo from '../components/ui/ARTTLogo';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet><title>Page Not Found - ARTT</title></Helmet>

      <div className="min-h-screen bg-black text-cream flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          aria-hidden="true"
        >
          <span className="font-display font-light text-[30vw] leading-none text-white/[0.03]">
            404
          </span>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute top-0 left-0 right-0 h-px bg-gold origin-left"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 text-center max-w-lg"
        >
          <div className="flex justify-center mb-12">
            <ARTTLogo light />
          </div>

          <p className="font-sans text-xs tracking-[0.5em] uppercase text-gold mb-6">
            Error 404
          </p>

          <h1 className="font-display text-5xl md:text-6xl font-light text-cream leading-tight mb-6">
            This canvas
            <br />
            is empty
          </h1>

          <div className="w-12 h-px bg-gold mx-auto mb-6" />

          <p className="font-sans text-sm text-light-gray leading-relaxed mb-12">
            The page you are looking for has been moved, removed, or never existed.
            Let us guide you back to the collection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn-gold inline-block w-full sm:w-auto text-center">
              Return Home
            </Link>
            <Link
              to="/shop"
              className="border border-cream/30 text-cream font-sans font-medium tracking-widest text-xs uppercase px-8 py-4 hover:border-gold hover:text-gold transition-all duration-300 w-full sm:w-auto text-center"
            >
              Browse Collection
            </Link>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-8 font-sans text-xs tracking-widest uppercase text-light-gray hover:text-gold transition-colors"
          >
            Back
          </button>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gold/30 origin-right"
        />
      </div>
    </>
  );
}
