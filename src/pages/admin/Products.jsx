import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch,
  HiOutlinePhotograph, HiStar, HiOutlineFilter,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui/FormElement';

const CATEGORIES = ['All', 'Painting', 'Sculpture', 'Photography', 'Digital Art', 'Drawing', 'Mixed Media', 'Printmaking'];

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.keyword = search;
      if (category !== 'All') params.category = category;
      const { data } = await api.get('/products', { params });
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, category]);

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchProducts(); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteTarget._id}`);
      toast.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const toggleFeatured = async (product) => {
    try {
      await api.put(`/products/${product._id}`, { isFeatured: !product.isFeatured });
      setProducts((prev) =>
        prev.map((p) => p._id === product._id ? { ...p, isFeatured: !p.isFeatured } : p)
      );
      toast.success(product.isFeatured ? 'Removed from featured' : 'Marked as featured');
    } catch {
      toast.error('Failed to update product');
    }
  };

  return (
    <>
      <Helmet><title>Manage Products – ARTT Admin</title></Helmet>

      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Admin Panel</p>
            <h1 className="font-display text-5xl font-light">Products</h1>
            <div className="w-12 h-px bg-gold mt-4" />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-light-gray">{total} artworks</span>
            <Link to="/admin/products/new">
              <Button variant="primary" size="sm" className="flex items-center gap-2">
                <HiOutlinePlus className="w-4 h-4" /> Add Artwork
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-gray" />
            <input
              type="text"
              placeholder="Search artworks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-beige bg-transparent font-sans text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <HiOutlineFilter className="w-4 h-4 text-light-gray flex-shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`font-sans text-xs tracking-widest uppercase px-3 py-2 border transition-colors ${
                  category === cat
                    ? 'bg-black text-cream border-black'
                    : 'border-beige text-black hover:border-gold hover:text-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="text-center py-32 border border-beige">
            <HiOutlinePhotograph className="w-16 h-16 text-light-gray mx-auto mb-6" />
            <h2 className="font-display text-3xl text-light-gray mb-4">No artworks found</h2>
            <Link to="/admin/products/new">
              <Button variant="primary" size="md">Add First Artwork</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="border border-beige overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-beige bg-beige/30">
                    {['Artwork', 'Category', 'Price', 'Stock', 'Status', 'Rating', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-4 text-left font-sans text-xs tracking-widest uppercase text-light-gray font-normal whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {products.map((product, i) => {
                      const img = product.images?.[0]?.url;
                      return (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-beige last:border-0 hover:bg-beige/20 transition-colors"
                        >
                          {/* Artwork */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-14 bg-beige flex-shrink-0 overflow-hidden">
                                {img
                                  ? <img src={img} alt={product.title} className="w-full h-full object-cover" />
                                  : <HiOutlinePhotograph className="w-6 h-6 text-light-gray m-auto mt-3" />
                                }
                              </div>
                              <div className="min-w-0">
                                <p className="font-sans text-sm font-medium truncate max-w-[160px]">{product.title}</p>
                                <p className="font-sans text-xs text-gold truncate">{product.artist}</p>
                                {product.isFeatured && (
                                  <span className="font-sans text-xs bg-gold text-black px-1.5 py-0.5 mt-0.5 inline-block">Featured</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-5 py-4">
                            <span className="font-sans text-xs tracking-widest uppercase text-light-gray">
                              {product.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-5 py-4">
                            <p className="font-display text-base font-light">₹{product.price?.toLocaleString('en-IN')}</p>
                            {product.originalPrice > product.price && (
                              <p className="font-sans text-xs text-light-gray line-through">
                                ₹{product.originalPrice?.toLocaleString('en-IN')}
                              </p>
                            )}
                          </td>

                          {/* Stock */}
                          <td className="px-5 py-4">
                            <span className={`font-sans text-sm ${product.stock === 0 ? 'text-red-500' : 'text-black'}`}>
                              {product.stock === 0 ? 'Out of stock' : product.stock}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-1">
                              {product.isSold && (
                                <span className="font-sans text-xs uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 w-fit">Sold</span>
                              )}
                              {product.isLimited && (
                                <span className="font-sans text-xs uppercase tracking-widest text-gold bg-gold/10 border border-gold/30 px-2 py-0.5 w-fit">Limited</span>
                              )}
                              {!product.isSold && !product.isLimited && (
                                <span className="font-sans text-xs uppercase tracking-widest text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 w-fit">Active</span>
                              )}
                            </div>
                          </td>

                          {/* Rating */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <HiStar className="w-3.5 h-3.5 text-gold" />
                              <span className="font-sans text-sm">{product.rating?.toFixed(1) || '0.0'}</span>
                              <span className="font-sans text-xs text-light-gray">({product.numReviews || 0})</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleFeatured(product)}
                                title={product.isFeatured ? 'Remove featured' : 'Mark featured'}
                                className={`p-2 border transition-colors ${
                                  product.isFeatured
                                    ? 'border-gold bg-gold text-black'
                                    : 'border-beige text-light-gray hover:border-gold hover:text-gold'
                                }`}
                              >
                                <HiStar className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                                className="p-2 border border-beige text-light-gray hover:border-black hover:text-black transition-colors"
                                title="Edit"
                              >
                                <HiOutlinePencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(product)}
                                className="p-2 border border-beige text-light-gray hover:border-red-400 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <HiOutlineTrash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="font-sans text-xs tracking-widest uppercase px-4 py-2 border border-beige hover:border-gold hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`font-sans text-xs tracking-widest w-9 h-9 border transition-colors ${
                      page === p ? 'bg-black text-cream border-black' : 'border-beige hover:border-gold hover:text-gold'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="font-sans text-xs tracking-widest uppercase px-4 py-2 border border-beige hover:border-gold hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Artwork"
      >
        <div className="p-6">
          <p className="font-sans text-sm text-light-gray mb-2">
            Are you sure you want to permanently delete:
          </p>
          <p className="font-display text-xl font-light mb-1">"{deleteTarget?.title}"</p>
          <p className="font-sans text-xs text-gold mb-6">by {deleteTarget?.artist}</p>
          <p className="font-sans text-xs text-red-500 mb-8">This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={handleDelete}
              className="flex-1"
            >
              Delete Permanently
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}