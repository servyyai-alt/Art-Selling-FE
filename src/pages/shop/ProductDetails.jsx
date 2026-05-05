import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HiOutlineHeart, HiHeart, HiOutlineShoppingBag,
  HiStar, HiChevronLeft, HiChevronRight, HiShare,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { fetchProduct, addReview } from '../../redux/productSlice';
import { addToCart } from '../../redux/cartSlice';
import { toggleWishlist } from '../../redux/wishlistSlice';
import { ProductSkeleton } from '../../components/ui/Loader';
import { Button } from '../../components/ui/FormElement';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, loading } = useSelector((s) => s.products);
  const { items: wishlistItems } = useSelector((s) => s.wishlist);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { loading: cartLoading } = useSelector((s) => s.cart);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
    window.scrollTo(0, 0);
  }, [id]);

  const isWishlisted = wishlistItems?.includes(product?._id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Sign in to add to cart'); navigate('/login'); return; }
    const result = await dispatch(addToCart({ productId: product._id, quantity: qty }));
    if (!result.error) toast.success('Added to cart');
    else toast.error(result.payload || 'Failed to add');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Sign in to save artworks'); return; }
    await dispatch(toggleWishlist(product._id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    const result = await dispatch(addReview({ id: product._id, reviewData: reviewForm }));
    setReviewLoading(false);
    if (!result.error) {
      toast.success('Review submitted!');
      setShowReviewForm(false);
      dispatch(fetchProduct(id));
    } else {
      toast.error(result.payload || 'Failed to submit review');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) return (
    <div className="pt-24 max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="aspect-[3/4] skeleton" />
        <div className="space-y-4 pt-8">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-4 w-3/4" />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="pt-24 text-center py-32">
      <p className="font-display text-3xl text-light-gray">Artwork not found</p>
      <button onClick={() => navigate('/shop')} className="btn-primary mt-6 inline-block">Back to Shop</button>
    </div>
  );

  const images = product.images?.length ? product.images : [{ url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800', alt: product.title }];

  return (
    <>
      <Helmet>
        <title>{product.title} – ARTT</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="pt-24 pb-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-light-gray">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-black">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Gallery */}
          <div>
            <div className="relative overflow-hidden bg-beige aspect-[4/5] mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={images[activeImg]?.url}
                  alt={images[activeImg]?.alt || product.title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 text-cream flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <HiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImg((p) => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 text-cream flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <HiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-20 overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-gold' : 'border-transparent'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="py-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">{product.artist}</p>
              <h1 className="font-display text-4xl md:text-5xl font-light leading-tight mb-2">{product.title}</h1>

              {/* Rating */}
              {product.numReviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <HiStar key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-gold' : 'text-beige'}`} />
                    ))}
                  </div>
                  <span className="font-sans text-xs text-light-gray">({product.numReviews} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-4 my-6">
                <span className="font-display text-3xl font-light">₹{product.price?.toLocaleString('en-IN')}</span>
                {product.originalPrice > product.price && (
                  <span className="font-sans text-lg text-light-gray line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
                {product.originalPrice > product.price && (
                  <span className="font-sans text-xs bg-gold/20 text-gold-dark px-2 py-0.5 tracking-widest">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              <div className="w-12 h-px bg-gold mb-6" />

              {/* Artwork details */}
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                {[
                  ['Category', product.category],
                  ['Medium', product.medium],
                  ['Year', product.year],
                  ['Style', product.style],
                  product.dimensions?.width && ['Dimensions', `${product.dimensions.width} × ${product.dimensions.height} ${product.dimensions.unit}`],
                ].filter(Boolean).map(([label, val]) => (
                  <div key={label}>
                    <dt className="font-sans text-xs tracking-widest uppercase text-light-gray">{label}</dt>
                    <dd className="font-sans text-sm mt-0.5">{val || '—'}</dd>
                  </div>
                ))}
              </dl>

              {/* Description */}
              <p className="font-sans text-sm text-mid-gray leading-relaxed mb-8">{product.description}</p>

              {/* Stock */}
              <div className="mb-6">
                {product.isSold || product.stock === 0 ? (
                  <span className="font-sans text-xs tracking-widest uppercase text-red-500 border border-red-200 px-3 py-1">Sold Out</span>
                ) : product.isLimited ? (
                  <span className="font-sans text-xs tracking-widest uppercase text-gold border border-gold px-3 py-1">Limited Edition – {product.stock} left</span>
                ) : (
                  <span className="font-sans text-xs tracking-widest uppercase text-green-700 border border-green-200 px-3 py-1">In Stock</span>
                )}
              </div>

              {/* Actions */}
              {!product.isSold && product.stock > 0 && (
                <div className="flex gap-3 mb-4">
                  {product.stock > 1 && (
                    <div className="flex items-center border border-beige">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-3 hover:bg-beige transition-colors text-lg">−</button>
                      <span className="px-4 font-sans text-sm">{qty}</span>
                      <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-3 hover:bg-beige transition-colors text-lg">+</button>
                    </div>
                  )}
                  <Button
                    onClick={handleAddToCart}
                    loading={cartLoading}
                    variant="primary"
                    size="md"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <HiOutlineShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </Button>
                  <button
                    onClick={handleWishlist}
                    className="w-14 border border-beige flex items-center justify-center hover:border-gold transition-colors"
                  >
                    {isWishlisted ? <HiHeart className="w-5 h-5 text-gold" /> : <HiOutlineHeart className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-14 border border-beige flex items-center justify-center hover:border-gold transition-colors"
                  >
                    <HiShare className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Artist bio */}
              {product.artistBio && (
                <div className="border-t border-beige pt-6 mt-6">
                  <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">About the Artist</p>
                  <p className="font-sans text-sm text-mid-gray leading-relaxed">{product.artistBio}</p>
                </div>
              )}

              {/* Shipping */}
              <div className="border-t border-beige pt-6 mt-6 space-y-2">
                {['Free shipping on orders above ₹50,000', 'Certificate of authenticity included', 'Secure packaging & insured delivery', '7-day return policy'].map((item) => (
                  <p key={item} className="font-sans text-xs text-mid-gray flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" /> {item}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20 border-t border-beige pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-light">Reviews ({product.numReviews || 0})</h2>
            {isAuthenticated && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-outline"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Review form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onSubmit={handleReview}
                className="bg-beige/40 p-6 mb-8 space-y-4"
              >
                <h3 className="font-display text-xl font-light">Your Review</h3>
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-mid-gray block mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                        <HiStar className={`w-6 h-6 transition-colors ${s <= reviewForm.rating ? 'text-gold' : 'text-beige'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-mid-gray block mb-2">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    rows={4}
                    required
                    placeholder="Share your experience with this artwork..."
                    className="w-full border border-beige bg-cream px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" variant="primary" loading={reviewLoading}>Submit</Button>
                  <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>Cancel</Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Reviews list */}
          {product.reviews?.length === 0 ? (
            <p className="font-sans text-sm text-light-gray py-8">No reviews yet. Be the first to review this artwork.</p>
          ) : (
            <div className="space-y-6">
              {product.reviews?.map((review) => (
                <div key={review._id} className="border-b border-beige pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-sans text-sm font-medium">{review.name}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[1,2,3,4,5].map((s) => (
                          <HiStar key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-gold' : 'text-beige'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="font-sans text-xs text-light-gray">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-mid-gray leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}