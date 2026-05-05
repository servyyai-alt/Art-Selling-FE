import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { HiArrowLeft, HiCheckCircle } from 'react-icons/hi';
import { fetchOrder } from '../../redux/ordersSlice';
import Loader from '../../components/ui/Loader';

const STATUS_ORDER = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [id]);

  if (loading || !order) return <Loader fullScreen />;

  const statusIdx = STATUS_ORDER.indexOf(order.orderStatus);

  return (
    <>
      <Helmet><title>Order #{order._id?.slice(-8).toUpperCase()} – ARTT</title></Helmet>
      <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
        <div className="py-6">
          <Link to="/orders" className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-light-gray hover:text-black transition-colors mb-6">
            <HiArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Order Details</p>
          <h1 className="font-display text-4xl font-light">Order #{order._id?.slice(-8).toUpperCase()}</h1>
          <p className="font-sans text-xs text-light-gray mt-2">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Status tracker */}
        {order.orderStatus !== 'Cancelled' && (
          <div className="mb-10 p-6 border border-beige">
            <h2 className="font-sans text-xs tracking-widest uppercase text-mid-gray mb-6">Order Progress</h2>
            <div className="flex items-center">
              {STATUS_ORDER.map((status, i) => (
                <React.Fragment key={status}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      i <= statusIdx ? 'bg-gold' : 'bg-beige'
                    }`}>
                      {i < statusIdx ? (
                        <HiCheckCircle className="w-5 h-5 text-black" />
                      ) : (
                        <span className="font-sans text-xs font-medium text-black">{i + 1}</span>
                      )}
                    </div>
                    <span className={`font-sans text-xs tracking-widest uppercase mt-2 ${i <= statusIdx ? 'text-black' : 'text-light-gray'}`}>
                      {status}
                    </span>
                  </div>
                  {i < STATUS_ORDER.length - 1 && (
                    <div className={`flex-1 h-px mx-2 ${i < statusIdx ? 'bg-gold' : 'bg-beige'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display text-2xl font-light mb-4">Items Ordered</h2>
            {order.orderItems?.map((item) => (
              <div key={item._id} className="flex gap-4 border-b border-beige pb-4">
                <div className="w-20 h-24 bg-beige overflow-hidden flex-shrink-0">
                  {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs tracking-widest uppercase text-gold">{item.artist}</p>
                  <p className="font-display text-lg font-light">{item.title}</p>
                  <p className="font-sans text-xs text-light-gray">Qty: {item.quantity}</p>
                </div>
                <p className="font-display text-lg font-light flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}

            {/* Price breakdown */}
            <div className="pt-4 space-y-2">
              {[
                ['Subtotal', order.itemsPrice],
                ['Shipping', order.shippingPrice],
                ['Tax (GST)', order.taxPrice],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between font-sans text-sm">
                  <span className="text-light-gray">{label}</span>
                  <span>{val === 0 ? 'Free' : `₹${val?.toLocaleString('en-IN')}`}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-beige pt-3">
                <span className="font-sans text-sm font-medium">Total</span>
                <span className="font-display text-xl">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-beige p-5">
              <h3 className="font-sans text-xs tracking-widest uppercase text-mid-gray mb-4">Shipping Address</h3>
              <p className="font-sans text-sm leading-relaxed">
                <strong>{order.shippingAddress?.name}</strong><br />
                {order.shippingAddress?.phone}<br />
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}<br />
                {order.shippingAddress?.country}
              </p>
            </div>

            <div className="border border-beige p-5">
              <h3 className="font-sans text-xs tracking-widest uppercase text-mid-gray mb-4">Payment Info</h3>
              <div className="space-y-2 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-light-gray">Status</span>
                  <span className={order.paymentInfo?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                    {order.paymentInfo?.status === 'paid' ? '✓ Paid' : 'Pending'}
                  </span>
                </div>
                {order.paymentInfo?.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-light-gray">Paid on</span>
                    <span className="text-xs">{new Date(order.paymentInfo.paidAt).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-light-gray">Tracking</span>
                    <span className="font-medium">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
