import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HiOutlineUsers, HiOutlinePhotograph, HiOutlineShoppingBag,
  HiOutlineCurrencyRupee, HiArrowRight, HiTrendingUp,
} from 'react-icons/hi';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

const STATUS_COLORS = {
  Processing: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  Confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
  Shipped: 'text-purple-600 bg-purple-50 border-purple-200',
  Delivered: 'text-green-600 bg-green-50 border-green-200',
  Cancelled: 'text-red-600 bg-red-50 border-red-200',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  const { stats, monthlyRevenue = [], recentOrders = [], topProducts = [] } = data || {};

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: HiOutlineCurrencyRupee,
      href: '/admin/orders',
      accent: 'gold',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: HiOutlineShoppingBag,
      href: '/admin/orders',
      accent: 'black',
    },
    {
      label: 'Artworks',
      value: stats?.totalProducts || 0,
      icon: HiOutlinePhotograph,
      href: '/admin/products',
      accent: 'black',
    },
    {
      label: 'Collectors',
      value: stats?.totalUsers || 0,
      icon: HiOutlineUsers,
      href: '/admin/users',
      accent: 'black',
    },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard – ARTT</title></Helmet>

      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="py-8">
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Admin Panel</p>
          <h1 className="font-display text-5xl font-light">Dashboard</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {[
            { label: 'Manage Products', href: '/admin/products' },
            { label: 'Add New Artwork', href: '/admin/products/new' },
            { label: 'Manage Orders', href: '/admin/orders' },
            { label: 'Manage Users', href: '/admin/users' },
          ].map((link) => (
            <motion.div key={link.href} variants={fadeUp}>
              <Link
                to={link.href}
                className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase border border-beige px-5 py-2.5 hover:border-gold hover:text-gold transition-colors"
              >
                {link.label} <HiArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {statCards.map((card, i) => (
            <motion.div key={card.label} variants={fadeUp} custom={i}>
              <Link to={card.href} className="group block border border-beige p-6 hover:border-gold transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 flex items-center justify-center ${i === 0 ? 'bg-gold text-black' : 'bg-beige text-black'}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <HiArrowRight className="w-4 h-4 text-light-gray group-hover:text-gold transition-colors" />
                </div>
                <p className="font-display text-3xl font-light mb-1">{card.value}</p>
                <p className="font-sans text-xs tracking-widest uppercase text-light-gray">{card.label}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue Chart + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 border border-beige p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-1">Revenue</p>
                <h2 className="font-display text-2xl font-light">Monthly Overview</h2>
              </div>
              <HiTrendingUp className="w-5 h-5 text-gold" />
            </div>

            {monthlyRevenue.length === 0 ? (
              <div className="h-48 flex items-center justify-center">
                <p className="font-sans text-xs tracking-widest uppercase text-light-gray">No data yet</p>
              </div>
            ) : (
              <div className="flex items-end gap-2 h-48">
                {monthlyRevenue.map((m, i) => {
                  const height = Math.max((m.revenue / maxRevenue) * 100, 4);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full flex justify-center">
                        <div
                          className="w-full bg-beige group-hover:bg-gold transition-colors duration-300 cursor-default"
                          style={{ height: `${(height / 100) * 160}px` }}
                          title={`₹${m.revenue.toLocaleString('en-IN')}`}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-cream font-sans text-xs px-2 py-1 whitespace-nowrap pointer-events-none z-10">
                          ₹{m.revenue.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <span className="font-sans text-xs text-light-gray">
                        {MONTHS[(m._id?.month || 1) - 1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="border border-beige p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-1">Best Selling</p>
                <h2 className="font-display text-2xl font-light">Top Artworks</h2>
              </div>
            </div>
            {topProducts.length === 0 ? (
              <p className="font-sans text-xs text-light-gray">No sales data yet.</p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-display text-2xl font-light text-beige w-6 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm truncate">{p.title || 'Unknown'}</p>
                      <p className="font-sans text-xs text-light-gray">{p.count} sold · ₹{(p.revenue || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="border border-beige"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-beige">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-1">Latest Activity</p>
              <h2 className="font-display text-2xl font-light">Recent Orders</h2>
            </div>
            <Link
              to="/admin/orders"
              className="font-sans text-xs tracking-widest uppercase text-light-gray hover:text-gold transition-colors flex items-center gap-1"
            >
              View All <HiArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-sans text-xs text-light-gray">No orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-beige">
                    {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left font-sans text-xs tracking-widest uppercase text-light-gray font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-beige last:border-0 hover:bg-beige/30 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/orders`}
                          className="font-sans text-xs tracking-widest uppercase text-gold hover:text-gold-dark transition-colors"
                        >
                          #{order._id?.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-sans text-sm">{order.user?.name || '—'}</p>
                        <p className="font-sans text-xs text-light-gray">{order.user?.email || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-sans text-sm">{order.orderItems?.length || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-display text-base font-light">
                          ₹{order.totalPrice?.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-sans text-xs tracking-widest uppercase border px-2 py-0.5 ${STATUS_COLORS[order.orderStatus] || 'text-light-gray bg-beige border-beige'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-sans text-xs text-light-gray">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}