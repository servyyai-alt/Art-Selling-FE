import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../redux/wishlistSlice';
import { addToCart } from '../../redux/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = memo(function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((s) => s.wishlist);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const isWishlisted = wishlistItems?.includes(product._id);
  const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600';

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Sign in to save artworks'); return; }
    await dispatch(toggleWishlist(product._id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    await dispatch(addToCart({ productId: product._id }));
    toast.success('Added to cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product._id}`} className="group block">
        {/* Image container */}
        <div className="relative overflow-hidden bg-beige aspect-[3/4] mb-4">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Overlays */}
          {product.isSold && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="font-sans text-xs tracking-widest uppercase text-cream border border-cream px-4 py-2">Sold</span>
            </div>
          )}
          {product.isLimited && !product.isSold && (
            <div className="absolute top-3 left-3">
              <span className="font-sans text-xs tracking-widest uppercase text-black bg-gold px-3 py-1">Limited</span>
            </div>
          )}
          {product.isFeatured && !product.isLimited && (
            <div className="absolute top-3 left-3">
              <span className="font-sans text-xs tracking-widest uppercase text-cream bg-black px-3 py-1">Featured</span>
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 p-3">
            {!product.isSold && (
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-cream font-sans text-xs tracking-widest uppercase py-3 hover:bg-gold hover:text-black transition-colors"
              >
                Add to Cart
              </button>
            )}
            <button
              onClick={handleWishlist}
              className="w-12 bg-cream text-black flex items-center justify-center hover:bg-gold transition-colors"
            >
              {isWishlisted
                ? <HiHeart className="w-4 h-4 text-gold" />
                : <HiOutlineHeart className="w-4 h-4" />
              }
            </button>
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-1">{product.artist}</p>
          <h3 className="font-display text-lg font-light leading-snug mb-1 group-hover:text-gold transition-colors">
            {product.title}
          </h3>
          <p className="font-sans text-xs text-light-gray mb-2">
            {product.medium} {product.dimensions?.width && `· ${product.dimensions.width}×${product.dimensions.height} ${product.dimensions.unit}`}
          </p>
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-light">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-sans text-sm text-light-gray line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default ProductCard;