import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineBan,
  HiOutlineCheckCircle,
  HiOutlineShoppingBag,
  HiArrowLeft,
  HiChevronDown,
  HiChevronUp,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [togglingId, setTogglingId] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setPages(Math.ceil((data.total || 0) / 15));
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleToggleStatus = async (user) => {
    setTogglingId(user._id);
    try {
      await api.put(`/admin/users/${user._id}/toggle`);
      setUsers((prev) =>
        prev.map((u) => u._id === user._id ? { ...u, isActive: !u.isActive } : u)
      );
      toast.success(`${user.name} ${user.isActive ? 'deactivated' : 'activated'}`);
    } catch {
      toast.error('Failed to update user status');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      <Helmet><title>Manage Users - ARTT Admin</title></Helmet>

      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
        <div className="py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link
              to="/admin"
              className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-light-gray hover:text-black transition-colors mb-6"
            >
              <HiArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Admin Panel</p>
            <h1 className="font-display text-5xl font-light">Users</h1>
            <div className="w-12 h-px bg-gold mt-4" />
          </div>
          <span className="font-sans text-xs text-light-gray">{total} collectors registered</span>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-gray" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-beige bg-transparent font-sans text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : users.length === 0 ? (
          <div className="text-center py-32 border border-beige">
            <HiOutlineUsers className="w-16 h-16 text-light-gray mx-auto mb-6" />
            <h2 className="font-display text-3xl text-light-gray">No users found</h2>
          </div>
        ) : (
          <>
            <div className="border border-beige overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-beige bg-beige/30">
                    {['User', 'Role', 'Joined', 'Status', 'Orders', 'Spent', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left font-sans text-xs tracking-widest uppercase text-light-gray font-normal whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <React.Fragment key={user._id}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-beige hover:bg-beige/20 transition-colors cursor-pointer"
                        onClick={() => setExpandedUserId((prev) => prev === user._id ? null : user._id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-beige flex items-center justify-center flex-shrink-0 font-display text-lg font-light">
                              {user.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-sans text-sm font-medium">{user.name}</p>
                              <p className="font-sans text-xs text-light-gray">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`font-sans text-xs tracking-widest uppercase border px-2 py-0.5 ${
                            user.role === 'admin'
                              ? 'text-gold bg-gold/10 border-gold/30'
                              : 'text-light-gray bg-beige border-beige'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-sans text-xs text-light-gray">
                            {new Date(user.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {user.isActive !== false ? (
                            <span className="font-sans text-xs uppercase tracking-widest text-green-600 bg-green-50 border border-green-200 px-2 py-0.5">
                              Active
                            </span>
                          ) : (
                            <span className="font-sans text-xs uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-2 py-0.5">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <HiOutlineShoppingBag className="w-3.5 h-3.5 text-light-gray" />
                            <span className="font-sans text-sm">{user.orderCount || 0}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-display text-base font-light">
                            Rs {(user.totalSpent || 0).toLocaleString('en-IN')}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
                            {user.role !== 'admin' ? (
                              <button
                                onClick={() => handleToggleStatus(user)}
                                disabled={togglingId === user._id}
                                title={user.isActive !== false ? 'Deactivate user' : 'Activate user'}
                                className={`p-2 border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                  user.isActive !== false
                                    ? 'border-beige text-light-gray hover:border-red-400 hover:text-red-500'
                                    : 'border-beige text-light-gray hover:border-green-500 hover:text-green-600'
                                }`}
                              >
                                {togglingId === user._id ? (
                                  <span className="w-3.5 h-3.5 block border border-current border-t-transparent rounded-full animate-spin" />
                                ) : user.isActive !== false ? (
                                  <HiOutlineBan className="w-3.5 h-3.5" />
                                ) : (
                                  <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                                )}
                              </button>
                            ) : (
                              <span className="font-sans text-xs text-light-gray italic">Admin</span>
                            )}

                            <button
                              type="button"
                              onClick={() => setExpandedUserId((prev) => prev === user._id ? null : user._id)}
                              className="text-light-gray hover:text-black transition-colors"
                            >
                              {expandedUserId === user._id ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </motion.tr>

                      {expandedUserId === user._id && (
                        <tr className="border-b border-beige bg-beige/10">
                          <td colSpan="7" className="px-6 py-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div>
                                <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-4">Recent Orders</p>
                                {user.recentOrders?.length ? (
                                  <div className="space-y-3">
                                    {user.recentOrders.map((order) => (
                                      <div key={order._id} className="border border-beige bg-cream/60 p-4">
                                        <div className="flex items-center justify-between gap-4 mb-2">
                                          <p className="font-sans text-xs tracking-widest uppercase text-gold">
                                            #{order._id.slice(-8).toUpperCase()}
                                          </p>
                                          <span className="font-sans text-xs text-light-gray">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                              day: 'numeric',
                                              month: 'short',
                                              year: 'numeric',
                                            })}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                          <div>
                                            <p className="font-sans text-sm">{order.orderStatus}</p>
                                            <p className={`font-sans text-xs ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
                                              {order.paymentStatus === 'paid' ? 'Paid' : 'Pending payment'}
                                            </p>
                                          </div>
                                          <p className="font-display text-lg font-light">
                                            Rs {order.totalPrice?.toLocaleString('en-IN')}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="font-sans text-sm text-light-gray">No orders placed yet.</p>
                                )}
                              </div>

                              <div>
                                <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-4">Customer Snapshot</p>
                                <div className="border border-beige bg-cream/60 p-5 space-y-3">
                                  <div className="flex justify-between gap-4">
                                    <span className="font-sans text-sm text-light-gray">Phone</span>
                                    <span className="font-sans text-sm">{user.phone || 'Not added'}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="font-sans text-sm text-light-gray">Saved addresses</span>
                                    <span className="font-sans text-sm">{user.addresses?.length || 0}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="font-sans text-sm text-light-gray">Lifetime orders</span>
                                    <span className="font-sans text-sm">{user.orderCount || 0}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="font-sans text-sm text-light-gray">Lifetime spend</span>
                                    <span className="font-sans text-sm">Rs {(user.totalSpent || 0).toLocaleString('en-IN')}</span>
                                  </div>
                                  {user.addresses?.[0] && (
                                    <div className="pt-3 border-t border-beige">
                                      <p className="font-sans text-xs tracking-widest uppercase text-light-gray mb-2">Default Address</p>
                                      {(() => {
                                        const defaultAddress = user.addresses.find((address) => address.isDefault) || user.addresses[0];
                                        return (
                                          <div className="font-sans text-sm text-mid-gray leading-relaxed">
                                            <p className="text-black font-medium">{defaultAddress.name}</p>
                                            <p>{defaultAddress.phone}</p>
                                            <p>{defaultAddress.street}</p>
                                            <p>{defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}</p>
                                            <p>{defaultAddress.country}</p>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="font-sans text-xs tracking-widest uppercase px-4 py-2 border border-beige hover:border-gold hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
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
