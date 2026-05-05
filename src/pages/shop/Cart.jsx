import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiX, HiOutlineShoppingBag, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { updateCartItem, removeFromCart } from '../../redux/cartSlice';
import { Button } from '../../components/ui/FormElement';
import Loader from '../../components/ui/Loader';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const handleQtyChange = async (productId, qty) => {
    if (qty < 1) return;
    await dispatch(updateCartItem({ productId, quantity: qty }));
  };

  const handleRemove = async (productId, title) => {
    await dispatch(removeFromCart(productId));
    toast.success(`${title} removed from cart`);
  };

  const shippingPrice = totalPrice >= 50000 ? 0 : 500;
  const gst = Math.round(totalPrice * 0.18);
  const orderTotal = totalPrice + shippingPrice + gst;

  if (!isAuthenticated) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center flex-col gap-6 px-6 text-center">
        <HiOutlineShoppingBag className="w-16 h-16 text-light-gray" />
        <h2 className="font-display text-3xl font-light">Sign in to view your cart</h2>
        <p className="font-sans text-sm text-light-gray">Your cart items are saved when you're logged in</p>
        <Link to="/login" className="btn-primary inline-block">Sign In</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Shopping Cart – ARTT</title></Helmet>
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">

        <div className="py-8">
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Your Selection</p>
          <h1 className="font-display text-5xl font-light">Shopping Cart</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <div className="text-center py-32">
            <HiOutlineShoppingBag className="w-16 h-16 text-light-gray mx-auto mb-6" />
            <h2 className="font-display text-3xl text-light-gray mb-4">Your cart is empty</h2>
            <p className="font-sans text-sm text-light-gray mb-8">Discover extraordinary artworks in our collection</p>
            <Link to="/shop" className="btn-primary inline-block">Browse Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-beige font-sans text-xs tracking-widest uppercase text-light-gray mb-2">
                <div className="col-span-6">Artwork</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <AnimatePresence>
                {items.map((item) => {
                  const p = item.product;
                  if (!p) return null;
                  const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400';
                  return (
                    <motion.div
                      key={item._id || p._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-12 gap-4 items-center py-6 border-b border-beige"
                    >
                      {/* Image + title */}
                      <div className="col-span-12 md:col-span-6 flex gap-4">
                        <Link to={`/product/${p._id}`} className="flex-shrink-0 w-20 h-24 overflow-hidden bg-beige">
                          <img src={img} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </Link>
                        <div className="flex flex-col justify-between py-1 min-w-0">
                          <div>
                            <p className="font-sans text-xs tracking-widest uppercase text-gold mb-0.5">{p.artist}</p>
                            <Link to={`/product/${p._id}`} className="font-display text-lg font-light hover:text-gold transition-colors line-clamp-2">
                              {p.title}
                            </Link>
                            <p className="font-sans text-xs text-light-gray mt-1">{p.medium}</p>
                          </div>
                          <button
                            onClick={() => handleRemove(p._id, p.title)}
                            className="flex items-center gap-1 font-sans text-xs text-light-gray hover:text-red-500 transition-colors w-fit mt-2"
                          >
                            <HiX className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-4 md:col-span-2 text-center">
                        <span className="font-sans text-sm">₹{item.price?.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Qty */}
                      <div className="col-span-4 md:col-span-2 flex justify-center">
                        {p.stock > 1 ? (
                          <div className="flex items-center border border-beige">
                            <button
                              onClick={() => handleQtyChange(p._id, item.quantity - 1)}
                              className="px-2 py-1.5 hover:bg-beige transition-colors"
                              disabled={item.quantity <= 1}
                            >−</button>
                            <span className="px-3 font-sans text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleQtyChange(p._id, item.quantity + 1)}
                              className="px-2 py-1.5 hover:bg-beige transition-colors"
                              disabled={item.quantity >= p.stock}
                            >+</button>
                          </div>
                        ) : (
                          <span className="font-sans text-sm">1</span>
                        )}
                      </div>

                      {/* Total */}
                      <div className="col-span-4 md:col-span-2 text-right">
                        <span className="font-display text-lg font-light">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <div className="mt-6">
                <Link to="/shop" className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-light-gray hover:text-black transition-colors">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-dark-gray text-cream p-8">
                <h2 className="font-display text-2xl font-light mb-6">Order Summary</h2>
                <div className="space-y-4 font-sans text-sm">
                  <div className="flex justify-between">
                    <span className="text-light-gray">Subtotal ({items.length} items)</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">Shipping</span>
                    <span>{shippingPrice === 0 ? <span className="text-gold">Free</span> : `₹${shippingPrice.toLocaleString('en-IN')}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">GST (18%)</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  {totalPrice < 50000 && (
                    <p className="font-sans text-xs text-gold border border-gold/30 px-3 py-2">
                      Add ₹{(50000 - totalPrice).toLocaleString('en-IN')} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-mid-gray pt-4 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-display text-xl">₹{orderTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/checkout')}
                  variant="gold"
                  size="lg"
                  className="w-full mt-8 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <HiArrowRight className="w-4 h-4" />
                </Button>

                <div className="mt-6 space-y-2">
                  {['Secure SSL checkout', 'Multiple payment options', 'Insured shipping'].map((t) => (
                    <p key={t} className="font-sans text-xs text-light-gray flex items-center gap-2">
                      <span className="w-1 h-1 bg-gold rounded-full flex-shrink-0" /> {t}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}