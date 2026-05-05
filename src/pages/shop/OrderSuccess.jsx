import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiCheckCircle } from 'react-icons/hi';
import { fetchOrder } from '../../redux/ordersSlice';
import Loader from '../../components/ui/Loader';

export default function OrderSuccess() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrder(id));
  }, [id]);

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <Helmet><title>Order Confirmed – ARTT</title></Helmet>
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <HiCheckCircle className="w-12 h-12 text-gold" />
          </motion.div>

          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">Thank You</p>
          <h1 className="font-display text-4xl font-light mb-4">Order Confirmed!</h1>
          <div className="w-12 h-px bg-gold mx-auto mb-6" />
          <p className="font-sans text-sm text-mid-gray leading-relaxed mb-8">
            Your order has been placed successfully. You'll receive a confirmation email shortly with tracking details.
          </p>

          {order && (
            <div className="bg-beige/40 p-6 text-left mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans text-xs tracking-widest uppercase text-light-gray">Order ID</span>
                <span className="font-sans text-sm font-medium">#{order._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans text-xs tracking-widest uppercase text-light-gray">Items</span>
                <span className="font-sans text-sm">{order.orderItems?.length} artwork{order.orderItems?.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans text-xs tracking-widest uppercase text-light-gray">Total</span>
                <span className="font-display text-xl font-light">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs tracking-widest uppercase text-light-gray">Status</span>
                <span className="font-sans text-xs tracking-widest uppercase text-green-700 bg-green-50 px-3 py-1">{order.orderStatus}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders" className="btn-primary inline-block">View My Orders</Link>
            <Link to="/shop" className="btn-outline inline-block">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}