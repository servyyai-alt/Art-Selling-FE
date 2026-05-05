import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HiOutlinePhotograph, HiOutlineCloudUpload, HiX, HiArrowLeft,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';
import { Button, Input, Select, Textarea } from '../../components/ui/FormElement';

const CATEGORIES = ['Painting', 'Sculpture', 'Photography', 'Digital Art', 'Drawing', 'Mixed Media', 'Printmaking'];
const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c, label: c }));

const EMPTY_FORM = {
  title: '',
  description: '',
  artist: '',
  artistBio: '',
  price: '',
  originalPrice: '',
  category: 'Painting',
  medium: '',
  year: '',
  style: '',
  stock: '1',
  tags: '',
  isFeatured: false,
  isLimited: false,
  dimensions: { width: '', height: '', depth: '', unit: 'cm' },
};

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);        // existing image objects {url, publicId}
  const [newFiles, setNewFiles] = useState([]);    // File objects to upload
  const [newPreviews, setNewPreviews] = useState([]); // preview URLs for new files
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});

  /* ---------- Fetch existing product ---------- */
  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${id}`)
      .then(({ data }) => {
        const p = data.product;
        setForm({
          title: p.title || '',
          description: p.description || '',
          artist: p.artist || '',
          artistBio: p.artistBio || '',
          price: p.price ?? '',
          originalPrice: p.originalPrice ?? '',
          category: p.category || 'Painting',
          medium: p.medium || '',
          year: p.year ?? '',
          style: p.style || '',
          stock: p.stock ?? '1',
          tags: p.tags?.join(', ') || '',
          isFeatured: p.isFeatured || false,
          isLimited: p.isLimited || false,
          dimensions: {
            width: p.dimensions?.width ?? '',
            height: p.dimensions?.height ?? '',
            depth: p.dimensions?.depth ?? '',
            unit: p.dimensions?.unit || 'cm',
          },
        });
        setImages(p.images || []);
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setFetchLoading(false));
  }, [id]);

  /* ---------- Helpers ---------- */
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setDim = (key, value) => setForm((f) => ({ ...f, dimensions: { ...f.dimensions, [key]: value } }));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const total = images.length + newFiles.length + files.length;
    if (total > 5) { toast.error('Maximum 5 images allowed'); return; }
    setNewFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setNewPreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));
  const removeNewImage = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.artist.trim()) e.artist = 'Artist name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || Number(form.price) <= 0) e.price = 'Valid price is required';
    if (!form.category) e.category = 'Category is required';
    if (images.length === 0 && newFiles.length === 0) e.images = 'At least one image is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors below'); return; }

    setLoading(true);
    try {
      // Upload new images first
      let uploadedImages = [...images];
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((f) => formData.append('images', f));
        const { data: uploadData } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImages = [...uploadedImages, ...(uploadData.images || [])];
      }

      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
        year: form.year ? Number(form.year) : undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        images: uploadedImages,
        dimensions: {
          width: form.dimensions.width ? Number(form.dimensions.width) : undefined,
          height: form.dimensions.height ? Number(form.dimensions.height) : undefined,
          depth: form.dimensions.depth ? Number(form.dimensions.depth) : undefined,
          unit: form.dimensions.unit,
        },
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Artwork updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Artwork created successfully');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save artwork');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <Loader fullScreen />;

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Artwork' : 'Add Artwork'} – ARTT Admin</title>
      </Helmet>

      <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="py-8">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-light-gray hover:text-black transition-colors mb-6"
          >
            <HiArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Admin Panel</p>
          <h1 className="font-display text-5xl font-light">{isEdit ? 'Edit Artwork' : 'Add New Artwork'}</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* Images Section */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SectionTitle>Images</SectionTitle>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
              {/* Existing images */}
              {images.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] bg-beige overflow-hidden group">
                  <img src={img.url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                  {i === 0 && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-cream font-sans text-xs text-center py-1">
                      Main
                    </div>
                  )}
                </div>
              ))}
              {/* New image previews */}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative aspect-[3/4] bg-beige overflow-hidden group">
                  <img src={src} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-gold/70 text-black font-sans text-xs text-center py-1">
                    New
                  </div>
                </div>
              ))}
              {/* Upload button */}
              {(images.length + newFiles.length) < 5 && (
                <label className="aspect-[3/4] border-2 border-dashed border-beige hover:border-gold transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-beige/20">
                  <HiOutlineCloudUpload className="w-6 h-6 text-light-gray" />
                  <span className="font-sans text-xs text-light-gray text-center px-1">Upload Image</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
            {errors.images && <p className="font-sans text-xs text-red-500">{errors.images}</p>}
            <p className="font-sans text-xs text-light-gray">Up to 5 images. First image is used as the main display.</p>
          </motion.section>

          {/* Basic Info */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <SectionTitle>Basic Information</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Title *"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  error={errors.title}
                  placeholder="e.g. Coastal Serenity No. 4"
                />
              </div>
              <Input
                label="Artist Name *"
                value={form.artist}
                onChange={(e) => set('artist', e.target.value)}
                error={errors.artist}
                placeholder="e.g. Alangudi Subramaniam"
              />
              <Select
                label="Category *"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                options={CATEGORY_OPTIONS}
                error={errors.category}
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Description *"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  error={errors.description}
                  placeholder="Describe the artwork, its inspiration, technique, and significance..."
                  rows={5}
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  label="Artist Bio"
                  value={form.artistBio}
                  onChange={(e) => set('artistBio', e.target.value)}
                  placeholder="Brief biography of the artist..."
                  rows={3}
                />
              </div>
            </div>
          </motion.section>

          {/* Pricing & Inventory */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SectionTitle>Pricing & Inventory</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Price (₹) *"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                error={errors.price}
                placeholder="0"
              />
              <Input
                label="Original Price (₹)"
                type="number"
                min="0"
                value={form.originalPrice}
                onChange={(e) => set('originalPrice', e.target.value)}
                placeholder="For showing discount"
              />
              <Input
                label="Stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                placeholder="1"
              />
            </div>
          </motion.section>

          {/* Artwork Details */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SectionTitle>Artwork Details</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Medium"
                value={form.medium}
                onChange={(e) => set('medium', e.target.value)}
                placeholder="e.g. Oil on Canvas"
              />
              <Input
                label="Style"
                value={form.style}
                onChange={(e) => set('style', e.target.value)}
                placeholder="e.g. Abstract, Realism"
              />
              <Input
                label="Year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                placeholder={new Date().getFullYear()}
              />
            </div>

            {/* Dimensions */}
            <div className="mt-6">
              <label className="block font-sans text-xs tracking-widest uppercase text-mid-gray mb-3">Dimensions</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  label="Width"
                  type="number"
                  min="0"
                  value={form.dimensions.width}
                  onChange={(e) => setDim('width', e.target.value)}
                  placeholder="0"
                />
                <Input
                  label="Height"
                  type="number"
                  min="0"
                  value={form.dimensions.height}
                  onChange={(e) => setDim('height', e.target.value)}
                  placeholder="0"
                />
                <Input
                  label="Depth"
                  type="number"
                  min="0"
                  value={form.dimensions.depth}
                  onChange={(e) => setDim('depth', e.target.value)}
                  placeholder="0"
                />
                <Select
                  label="Unit"
                  value={form.dimensions.unit}
                  onChange={(e) => setDim('unit', e.target.value)}
                  options={[
                    { value: 'cm', label: 'cm' },
                    { value: 'in', label: 'inches' },
                    { value: 'mm', label: 'mm' },
                  ]}
                />
              </div>
            </div>

            <div className="mt-6">
              <Input
                label="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="e.g. abstract, blue, coastal, contemporary"
              />
            </div>
          </motion.section>

          {/* Flags */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SectionTitle>Display Options</SectionTitle>
            <div className="flex flex-wrap gap-6">
              <ToggleField
                label="Featured Artwork"
                description="Shown on the homepage in the featured section"
                checked={form.isFeatured}
                onChange={(v) => set('isFeatured', v)}
              />
              <ToggleField
                label="Limited Edition"
                description="Shows a 'Limited' badge on the product card"
                checked={form.isLimited}
                onChange={(v) => set('isLimited', v)}
              />
            </div>
          </motion.section>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4 border-t border-beige">
            <Button type="submit" variant="primary" size="lg" loading={loading}>
              {isEdit ? 'Save Changes' : 'Publish Artwork'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/admin/products')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

/* ---------- Sub-components ---------- */
function SectionTitle({ children }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl font-light">{children}</h2>
      <div className="w-8 h-px bg-gold mt-2" />
    </div>
  );
}

function ToggleField({ label, description, checked, onChange }) {
  return (
    <div
      className={`flex items-start gap-4 p-5 border cursor-pointer transition-colors ${
        checked ? 'border-gold bg-gold/5' : 'border-beige hover:border-gold/50'
      }`}
      onClick={() => onChange(!checked)}
    >
      <div className={`w-5 h-5 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
        checked ? 'bg-gold border-gold' : 'border-mid-gray'
      }`}>
        {checked && (
          <svg viewBox="0 0 12 12" className="w-3 h-3 fill-black">
            <polyline points="1,6 4,10 11,2" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div>
        <p className="font-sans text-sm font-medium">{label}</p>
        <p className="font-sans text-xs text-light-gray mt-0.5">{description}</p>
      </div>
    </div>
  );
}