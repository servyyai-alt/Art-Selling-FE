import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { HiOutlineHeart } from 'react-icons/hi';
import { fetchWishlist } from '../redux/wishlistSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/ui/Loader';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Wishlist - ARTT</title>
      </Helmet>

      <div className="pt-24 pb-12 bg-dark-gray text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">Saved For Later</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-display text-5xl font-light">Your Wishlist</h1>
            <p className="font-sans text-sm text-cream/60">
              {products.length} {products.length === 1 ? 'artwork' : 'artworks'} saved
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full border border-beige mx-auto mb-6 flex items-center justify-center">
              <HiOutlineHeart className="w-9 h-9 text-light-gray" />
            </div>
            <h2 className="font-display text-3xl text-light-gray mb-4">Your wishlist is empty</h2>
            <p className="font-sans text-sm text-light-gray mb-8 max-w-xl mx-auto">
              Save the artworks that catch your eye and come back when you are ready to collect them.
            </p>
            <Link to="/shop" className="btn-primary inline-block">
              Explore Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Collected Favorites</p>
                <p className="font-sans text-sm text-light-gray">
                  Tap the heart on any card to remove it from your saved list.
                </p>
              </div>
              <Link
                to="/shop"
                className="hidden md:inline-flex font-sans text-xs tracking-widest uppercase text-light-gray hover:text-black transition-colors"
              >
                Continue Browsing
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
