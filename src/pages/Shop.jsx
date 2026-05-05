import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { HiAdjustments, HiX } from 'react-icons/hi';
import { fetchProducts, fetchMeta } from '../redux/productSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/ui/Loader';
import useDebounce from '../hooks/useDebounce';

export default function Shop() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, loading, total, pages, meta } = useSelector((s) => s.products);

  const [search, setSearch] = useState(searchParams.get('keyword') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    artist: searchParams.get('artist') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
    featured: searchParams.get('featured') || '',
  });
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => { dispatch(fetchMeta()); }, []);

  useEffect(() => {
    const params = { page, limit: 12, ...filters };
    if (debouncedSearch) params.keyword = debouncedSearch;
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    dispatch(fetchProducts(params));
  }, [debouncedSearch, filters, page]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', artist: '', minPrice: '', maxPrice: '', sort: '-createdAt', featured: '' });
    setSearch('');
    setPage(1);
  };

  const hasFilters = Object.values(filters).some((v) => v && v !== '-createdAt') || search;

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-rating', label: 'Highest Rated' },
  ];

  return (
    <>
      <Helmet>
        <title>Shop Original Art – ARTT</title>
      </Helmet>

      {/* Header */}
      <div className="pt-24 pb-12 bg-dark-gray text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">The Collection</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-display text-5xl font-light">All Artworks</h1>
            <p className="font-sans text-sm text-cream/60">{total} works available</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search artworks, artists, styles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-beige bg-transparent pl-4 pr-10 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-light-gray hover:text-black"
              >
                <HiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="border border-beige bg-cream px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors min-w-[180px]"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 border border-beige px-4 py-3 font-sans text-xs tracking-widest uppercase hover:border-gold transition-colors md:hidden"
          >
            <HiAdjustments className="w-4 h-4" />
            Filters
            {hasFilters && <span className="w-2 h-2 rounded-full bg-gold" />}
          </button>
        </div>

        <div className="flex gap-10">
          {/* Sidebar filters – desktop */}
          <aside className="hidden md:block w-60 flex-shrink-0">
            <FilterPanel
              filters={filters}
              meta={meta}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
              hasFilters={hasFilters}
            />
          </aside>

          {/* Mobile filters drawer */}
          <AnimatePresence>
            {filtersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setFiltersOpen(false)}
                  className="fixed inset-0 bg-black/40 z-40 md:hidden"
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween' }}
                  className="fixed top-0 left-0 bottom-0 w-72 bg-cream z-50 p-6 overflow-y-auto md:hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display text-xl">Filters</h3>
                    <button onClick={() => setFiltersOpen(false)}><HiX className="w-5 h-5" /></button>
                  </div>
                  <FilterPanel
                    filters={filters}
                    meta={meta}
                    onFilterChange={handleFilterChange}
                    onClear={clearFilters}
                    hasFilters={hasFilters}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(9).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-3xl text-light-gray mb-4">No artworks found</p>
                <p className="font-sans text-sm text-light-gray mb-8">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-16">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 font-sans text-sm transition-colors ${
                          page === p
                            ? 'bg-black text-cream'
                            : 'border border-beige hover:border-gold text-black'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FilterPanel({ filters, meta, onFilterChange, onClear, hasFilters }) {
  return (
    <div className="space-y-8">
      {hasFilters && (
        <button
          onClick={onClear}
          className="font-sans text-xs tracking-widest uppercase text-gold hover:text-gold-dark transition-colors flex items-center gap-2"
        >
          <HiX className="w-3 h-3" /> Clear All
        </button>
      )}

      {/* Category */}
      <div>
        <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-mid-gray">Category</h4>
        <div className="space-y-2">
          {['', ...(meta?.categories || [])].map((cat) => (
            <label key={cat || 'all'} className="flex items-center gap-3 cursor-pointer group">
              <span
                className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${
                  filters.category === cat ? 'bg-black border-black' : 'border-beige group-hover:border-mid-gray'
                }`}
                onClick={() => onFilterChange('category', cat)}
              >
                {filters.category === cat && <span className="w-2 h-2 bg-cream block" />}
              </span>
              <span className="font-sans text-sm cursor-pointer" onClick={() => onFilterChange('category', cat)}>
                {cat || 'All Categories'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Artist */}
      <div>
        <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-mid-gray">Artist</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {['', ...(meta?.artists || [])].map((artist) => (
            <label key={artist || 'all'} className="flex items-center gap-3 cursor-pointer group">
              <span
                className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${
                  filters.artist === artist ? 'bg-black border-black' : 'border-beige group-hover:border-mid-gray'
                }`}
                onClick={() => onFilterChange('artist', artist)}
              >
                {filters.artist === artist && <span className="w-2 h-2 bg-cream block" />}
              </span>
              <span className="font-sans text-sm truncate cursor-pointer" onClick={() => onFilterChange('artist', artist)}>
                {artist || 'All Artists'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-mid-gray">Price Range (₹)</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full border border-beige bg-transparent px-3 py-2 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full border border-beige bg-transparent px-3 py-2 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>
    </div>
  );
}