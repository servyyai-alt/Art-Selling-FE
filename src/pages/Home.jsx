import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchProducts } from '../redux/productSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/ui/Loader';
import ARTTLogo from '../components/ui/ARTTLogo';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1 } }),
};

export default function Home() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, limit: 4 }));
  }, []);

  const categories = [
    
  {
    name: 'Paintings',
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600',
    count: 24
  },
  {
    name: 'Sculpture',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600',
    count: 8
  },
    { name: 'Photography', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600', count: 15 },
    { name: 'Digital Art', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', count: 12 },
  ];

  return (
    <>
      <Helmet>
        <title>ARTT – Alangudi Subramaniam | Premium Art Marketplace</title>
        <meta name="description" content="Discover original artworks by celebrated South Indian artists. Paintings, sculpture, photography and digital art." />
      </Helmet>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.p
              variants={fadeUp}
              className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-6"
            >
              Alangudi Subramaniam Collection 2024
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-cream leading-[1.05] mb-8 max-w-3xl"
            >
              Art That
              <br />
              <em className="italic text-gold">Transcends</em>
              <br />
              Boundaries
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="font-sans text-base text-cream/70 max-w-md mb-12 leading-relaxed"
            >
              Discover original works from celebrated South Indian artists. Each piece tells a story of culture, emotion and timeless expression.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-gold inline-block text-center">
                Explore Collection
              </Link>
              <Link to="/shop?featured=true" className="btn-outline border-cream text-cream hover:bg-cream hover:text-black inline-block text-center">
                Featured Works
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-10 left-6 flex flex-col items-center gap-2"
          >
            <span className="font-sans text-xs tracking-widest uppercase text-cream/50">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-8 bg-gold/60"
            />
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-gold py-3 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex gap-12 whitespace-nowrap"
        >
          {Array(6).fill(['Original Art', 'Limited Editions', 'Museum Quality', 'South India\'s Finest', 'Free Shipping Above ₹50,000']).flat().map((text, i) => (
            <span key={i} className="font-sans text-xs tracking-widest uppercase text-black">
              {text} <span className="mx-4">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* FEATURED ARTWORKS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14"
        >
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">Curated Selection</p>
            <h2 className="section-title">Featured Artworks</h2>
          </div>
          <Link
            to="/shop?featured=true"
            className="font-sans text-xs tracking-widest uppercase text-black border-b border-black pb-0.5 hover:text-gold hover:border-gold transition-colors mt-4 md:mt-0"
          >
            View All Works
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : products.slice(0, 4).map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))
          }
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-dark-gray py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">Browse By</p>
            <h2 className="section-title text-cream">Art Categories</h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/shop?category=${cat.name}`}
                  className="group block relative overflow-hidden aspect-square"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="font-display text-2xl text-cream font-light">{cat.name}</h3>
                    <div className="w-8 h-px bg-gold mt-2 group-hover:w-16 transition-all duration-300" />
                    <p className="font-sans text-xs text-cream/70 mt-2 tracking-widest">{cat.count} works</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT ARTIST */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1545989253-02cc26577f88?w=700"
                alt="Artist at work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gold p-8 hidden lg:block">
              <p className="font-display text-4xl font-light text-black">15+</p>
              <p className="font-sans text-xs tracking-widest uppercase text-black/70 mt-1">Years of art</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans text-xs tracking-widest uppercase text-gold mb-4">The Artist</p>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
              Alangudi<br />
              <em className="italic">Subramaniam</em>
            </h2>
            <div className="w-16 h-px bg-gold mb-8" />
            <p className="font-sans text-base text-mid-gray leading-relaxed mb-6">
              Born in the temple town of Alangudi in Tamil Nadu, Subramaniam's work bridges ancient Dravidian artistic traditions and the language of contemporary expression. His canvases are meditations on identity, belonging, and the sacred feminine.
            </p>
            <p className="font-sans text-base text-mid-gray leading-relaxed mb-10">
              His signature use of ochre earth tones, silhouetted forms, and botanical motifs has earned him international recognition, with works in private collections across India, Singapore, and the United Kingdom.
            </p>
            <Link to="/shop?artist=Alangudi+Subramaniam" className="btn-primary inline-block">
              View Full Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-black py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 text-center"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-4">Stay Connected</p>
          <h2 className="font-display text-4xl text-cream font-light mb-4">
            Join the ARTT Collective
          </h2>
          <p className="font-sans text-sm text-cream/60 mb-10">
            Be the first to know about new works, artist events and exclusive collector previews.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border border-mid-gray text-cream px-5 py-4 font-sans text-sm focus:outline-none focus:border-gold transition-colors placeholder-light-gray"
            />
            <button className="btn-gold px-8 py-4 whitespace-nowrap">Subscribe</button>
          </div>
        </motion.div>
      </section>
    </>
  );
}