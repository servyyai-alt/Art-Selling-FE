import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HiOutlineShoppingBag, HiOutlineSearch, HiChevronDown, HiChevronUp, HiCheckCircle, HiArrowLeft
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';
import { Button } from '../../components/ui/FormElement';

const STATUS_OPTIONS = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Processing: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  Confirmed:  'text-blue-700   bg-blue-50   border-blue-200',
  Shipped:    'text-purple-700 bg-purple-50 border-purple-200',
  Delivered:  'text-green-700  bg-green-50  border-green-200',
  Cancelled:  'text-red-600   bg-red-50    border-red-200',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;
      const { data } = await api.get('/orders', { params });
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchOrders(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, orderStatus: newStatus } : o)
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Helmet><title>Manage Orders – ARTT Admin</title></Helmet>

      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="py-8">
          <Link
            to="/admin"
            className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-light-gray hover:text-black transition-colors mb-6"
          >
            <HiArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Admin Panel</p>
          <h1 className="font-display text-5xl font-light">Orders</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>


        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-gray" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-beige bg-transparent font-sans text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {['All', ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`font-sans text-xs tracking-widest uppercase px-3 py-2 border transition-colors ${
                  statusFilter === s
                    ? 'bg-black text-cream border-black'
                    : 'border-beige hover:border-gold hover:text-gold'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-light-gray font-sans text-xs ml-auto">
            <span>{total} orders</span>
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="text-center py-32 border border-beige">
            <HiOutlineShoppingBag className="w-16 h-16 text-light-gray mx-auto mb-6" />
            <h2 className="font-display text-3xl text-light-gray">No orders found</h2>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {orders.map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border border-beige"
                >
                  {/* Row */}
                  <div
                    className="grid grid-cols-12 gap-4 items-center px-6 py-4 cursor-pointer hover:bg-beige/20 transition-colors"
                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  >
                    {/* Order ID */}
                    <div className="col-span-12 md:col-span-2">
                      <p className="font-sans text-xs tracking-widest uppercase text-gold">
                        #{order._id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="font-sans text-xs text-light-gray mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Customer */}
                    <div className="col-span-6 md:col-span-3">
                      <p className="font-sans text-sm">{order.user?.name || 'Guest'}</p>
                      <p className="font-sans text-xs text-light-gray truncate">{order.user?.email || '—'}</p>
                    </div>

                    {/* Items */}
                    <div className="col-span-3 md:col-span-1 text-center">
                      <span className="font-sans text-sm">{order.orderItems?.length || 0}</span>
                      <p className="font-sans text-xs text-light-gray">items</p>
                    </div>

                    {/* Total */}
                    <div className="col-span-3 md:col-span-2">
                      <p className="font-display text-base font-light">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                      <p className={`font-sans text-xs ${order.paymentInfo?.status === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
                        {order.paymentInfo?.status === 'paid' ? '✓ Paid' : 'Unpaid'}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="col-span-6 md:col-span-2">
                      <span className={`font-sans text-xs tracking-widest uppercase border px-2 py-1 ${STATUS_COLORS[order.orderStatus] || 'text-light-gray bg-beige border-beige'}`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* Status Selector */}
                    <div className="col-span-5 md:col-span-2" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        disabled={updatingId === order._id || order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}
                        className="w-full border border-beige bg-cream font-sans text-xs px-2 py-1.5 focus:outline-none focus:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Expand chevron */}
                    <div className="col-span-1 flex justify-end">
                      {expanded === order._id
                        ? <HiChevronUp className="w-4 h-4 text-light-gray" />
                        : <HiChevronDown className="w-4 h-4 text-light-gray" />
                      }
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expanded === order._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-beige bg-beige/10 px-6 py-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Order Items */}
                        <div>
                          <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-4">Order Items</p>
                          <div className="space-y-3">
                            {order.orderItems?.map((item, j) => (
                              <div key={j} className="flex gap-3 items-center">
                                <div className="w-10 h-12 bg-beige flex-shrink-0 overflow-hidden">
                                  {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-sans text-sm truncate">{item.title}</p>
                                  <p className="font-sans text-xs text-light-gray">
                                    Qty {item.quantity} · ₹{item.price?.toLocaleString('en-IN')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address + Summary */}
                        <div className="space-y-6">
                          {order.shippingAddress && (
                            <div>
                              <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-3">Shipping Address</p>
                              <div className="font-sans text-sm space-y-1">
                                <p className="font-medium">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
                                <p>{order.shippingAddress.country}</p>
                                {order.shippingAddress.phone && <p className="text-light-gray">{order.shippingAddress.phone}</p>}
                              </div>
                            </div>
                          )}
                          <div>
                            <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-3">Order Summary</p>
                            <div className="font-sans text-sm space-y-1">
                              <div className="flex justify-between">
                                <span className="text-light-gray">Subtotal</span>
                                <span>₹{order.itemsPrice?.toLocaleString('en-IN') || '—'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-light-gray">Shipping</span>
                                <span>₹{order.shippingPrice?.toLocaleString('en-IN') || '—'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-light-gray">Tax</span>
                                <span>₹{order.taxPrice?.toLocaleString('en-IN') || '—'}</span>
                              </div>
                              <div className="flex justify-between font-medium border-t border-beige pt-2 mt-2">
                                <span>Total</span>
                                <span className="font-display text-lg font-light">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                          {order.paymentInfo?.razorpayOrderId && (
                            <div>
                              <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-1">Payment ID</p>
                              <p className="font-sans text-xs font-mono">{order.paymentInfo.razorpayOrderId}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
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
                    className={`font-sans text-xs w-9 h-9 border transition-colors ${
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
    </>
  );
}