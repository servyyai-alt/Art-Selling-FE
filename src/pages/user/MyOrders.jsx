import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag, HiChevronRight } from 'react-icons/hi';
import { fetchMyOrders } from '../../redux/ordersSlice';
import Loader from '../../components/ui/Loader';

const STATUS_COLORS = {
  Processing: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  Delivered: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
  'Return Requested': 'bg-orange-50 text-orange-700 border-orange-200',
  Refunded: 'bg-sky-50 text-sky-700 border-sky-200',
};

export default function OrderHistory() {
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <Helmet><title>My Orders - ARTT</title></Helmet>
      <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
        <div className="py-8">
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Account</p>
          <h1 className="font-display text-5xl font-light">My Orders</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32">
            <HiOutlineShoppingBag className="w-16 h-16 text-light-gray mx-auto mb-6" />
            <h2 className="font-display text-3xl text-light-gray mb-4">No orders yet</h2>
            <p className="font-sans text-sm text-light-gray mb-8">Start your collection with our curated artworks</p>
            <Link to="/shop" className="btn-primary inline-block">Explore Collection</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/orders/${order._id}`}
                  className="block border border-beige hover:border-gold transition-colors p-6 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-sans text-xs tracking-widest uppercase text-light-gray">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`font-sans text-xs tracking-widest uppercase border px-2 py-0.5 ${STATUS_COLORS[order.orderStatus] || ''}`}>
                          {order.orderStatus}
                        </span>
                        {order.paymentInfo?.status === 'paid' && (
                          <span className="font-sans text-xs text-green-600">Paid</span>
                        )}
                        {order.paymentInfo?.status === 'refunded' && (
                          <span className="font-sans text-xs text-sky-700">Refunded</span>
                        )}
                      </div>

                      <div className="flex gap-2 mb-3">
                        {order.orderItems?.slice(0, 3).map((item, j) => (
                          <div key={j} className="w-12 h-14 bg-beige overflow-hidden flex-shrink-0">
                            {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                          </div>
                        ))}
                        {order.orderItems?.length > 3 && (
                          <div className="w-12 h-14 bg-beige flex items-center justify-center flex-shrink-0">
                            <span className="font-sans text-xs text-light-gray">+{order.orderItems.length - 3}</span>
                          </div>
                        )}
                      </div>

                      <p className="font-sans text-xs text-light-gray">
                        {order.orderItems?.length} artwork{order.orderItems?.length !== 1 ? 's' : ''} ·{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      {order.returnRequest?.status === 'requested' && (
                        <p className="font-sans text-xs text-orange-700 mt-2">Return request pending review</p>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-1">Total</p>
                        <p className="font-display text-xl font-light">Rs {order.totalPrice?.toLocaleString('en-IN')}</p>
                      </div>
                      <HiChevronRight className="w-5 h-5 text-light-gray group-hover:text-gold transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
