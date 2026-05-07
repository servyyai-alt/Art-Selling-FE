import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function InfoPageLayout({
  title,
  description,
  eyebrow = 'Information',
  heroImage,
  children,
}) {
  return (
    <>
      <Helmet>
        <title>{title} - ARTT</title>
        <meta name="description" content={description} />
      </Helmet>

      <section className="relative overflow-hidden bg-black pt-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/55" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <nav className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-cream/60 mb-8">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gold">{title}</span>
            </nav>

            <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-4">{eyebrow}</p>
            <h1 className="font-display text-4xl md:text-6xl font-light text-cream leading-tight">
              {title}
            </h1>
            <div className="w-16 h-px bg-gold mt-6 mb-8" />
            <p className="font-sans text-base md:text-lg text-cream/75 leading-relaxed max-w-2xl">
              {description}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 border border-beige shadow-luxury p-8 md:p-12"
          >
            {children}
          </motion.div>
        </div>
      </section>
    </>
  );
}
