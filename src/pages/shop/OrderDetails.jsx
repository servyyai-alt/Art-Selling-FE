import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  HiArrowLeft,
  HiCheckCircle,
  HiOutlineRefresh,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

import { fetchOrder, requestReturn } from '../../redux/ordersSlice';
import Loader from '../../components/ui/Loader';
import {
  Button,
  Select,
  Textarea,
} from '../../components/ui/FormElement';

const STATUS_ORDER = [
  'Processing',
  'Confirmed',
  'Shipped',
  'Delivered',
];

const RETURN_REASONS = [
  { value: 'Damaged artwork', label: 'Damaged artwork' },
  { value: 'Wrong item delivered', label: 'Wrong item delivered' },
  {
    value: 'Issue with artwork condition',
    label: 'Issue with artwork condition',
  },
  { value: 'Other order issue', label: 'Other order issue' },
];

const PAYMENT_STATUS = {
  paid: {
    label: 'Paid',
    className: 'text-green-600',
  },
  pending: {
    label: 'Pending',
    className: 'text-yellow-600',
  },
  refunded: {
    label: 'Refunded',
    className: 'text-sky-700',
  },
  failed: {
    label: 'Failed',
    className: 'text-red-600',
  },
};

export default function OrderDetail() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const {
    currentOrder: order,
    loading,
    returnLoading,
  } = useSelector((s) => s.orders);

  const [returnForm, setReturnForm] = useState({
    reason: RETURN_REASONS[0].value,
    details: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchOrder(id));
    }
  }, [dispatch, id]);

  // SAFE VALUES
  const statusIdx = useMemo(() => {
    return STATUS_ORDER.indexOf(order?.orderStatus);
  }, [order?.orderStatus]);

  const deliveredAt = useMemo(() => {
    return order?.deliveredAt
      ? new Date(order.deliveredAt)
      : null;
  }, [order?.deliveredAt]);

  const returnDeadline = useMemo(() => {
    return deliveredAt
      ? new Date(
          deliveredAt.getTime() +
            7 * 24 * 60 * 60 * 1000
        )
      : null;
  }, [deliveredAt]);

  const isReturnWindowOpen = useMemo(() => {
    return returnDeadline
      ? Date.now() <= returnDeadline.getTime()
      : false;
  }, [returnDeadline]);

  const returnStatus = useMemo(() => {
    return order?.returnRequest?.status || 'none';
  }, [order?.returnRequest?.status]);

  const paymentStatus = useMemo(() => {
    return (
      PAYMENT_STATUS[
        order?.paymentInfo?.status
      ] || PAYMENT_STATUS.pending
    );
  }, [order?.paymentInfo?.status]);

  const canRequestReturn = useMemo(() => {
    return (
      order?.orderStatus === 'Delivered' &&
      order?.paymentInfo?.status === 'paid' &&
      isReturnWindowOpen &&
      returnStatus === 'none'
    );
  }, [
    order?.orderStatus,
    order?.paymentInfo?.status,
    isReturnWindowOpen,
    returnStatus,
  ]);

  const returnStatusLabel = useMemo(() => {
    if (returnStatus === 'requested')
      return 'Return Requested';

    if (returnStatus === 'rejected')
      return 'Return Rejected';

    if (returnStatus === 'refunded')
      return 'Refunded';

    return null;
  }, [returnStatus]);

  const handleReturnRequest = async (e) => {
    e.preventDefault();

    if (!order?._id) return;

    const result = await dispatch(
      requestReturn({
        id: order._id,
        reason: returnForm.reason,
        details: returnForm.details,
      })
    );

    if (!result.error) {
      toast.success('Return request submitted');

      setReturnForm({
        reason: RETURN_REASONS[0].value,
        details: '',
      });

      return;
    }

    toast.error(
      result.payload ||
        'Failed to submit return request'
    );
  };

  // CONDITIONAL RETURN AFTER ALL HOOKS
  if (loading || !order) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <Helmet>
        <title>
          Order #
          {order._id?.slice(-8).toUpperCase()} - ARTT
        </title>
      </Helmet>

      <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
        <div className="py-6">
          <Link
            to="/orders"
            className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-light-gray hover:text-black transition-colors mb-6"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>

          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">
            Order Details
          </p>

          <h1 className="font-display text-4xl font-light">
            Order #
            {order._id?.slice(-8).toUpperCase()}
          </h1>

          <p className="font-sans text-xs text-light-gray mt-2">
            Placed on{' '}
            {new Date(
              order.createdAt
            ).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {order.orderStatus !== 'Cancelled' &&
          order.orderStatus !== 'Refunded' && (
            <div className="mb-10 p-6 border border-beige">
              <h2 className="font-sans text-xs tracking-widest uppercase text-mid-gray mb-6">
                Order Progress
              </h2>

              <div className="flex items-center">
                {STATUS_ORDER.map(
                  (status, index) => (
                    <React.Fragment
                      key={status}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            index <= statusIdx
                              ? 'bg-gold'
                              : 'bg-beige'
                          }`}
                        >
                          {index < statusIdx ? (
                            <HiCheckCircle className="w-5 h-5 text-black" />
                          ) : (
                            <span className="font-sans text-xs font-medium text-black">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <span
                          className={`font-sans text-xs tracking-widest uppercase mt-2 ${
                            index <= statusIdx
                              ? 'text-black'
                              : 'text-light-gray'
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      {index <
                        STATUS_ORDER.length - 1 && (
                        <div
                          className={`flex-1 h-px mx-2 ${
                            index < statusIdx
                              ? 'bg-gold'
                              : 'bg-beige'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          )}

        {(returnStatusLabel || canRequestReturn || (order.orderStatus === 'Delivered' && !isReturnWindowOpen)) && (
          <div className="mb-10 border border-beige bg-beige/10 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Returns & Refunds</p>
                {returnStatusLabel ? (
                  <>
                    <h2 className="font-display text-2xl font-light mb-3">{returnStatusLabel}</h2>
                    <div className="space-y-2 font-sans text-sm text-mid-gray leading-relaxed">
                      <p><strong>Reason:</strong> {order.returnRequest?.reason}</p>
                      {order.returnRequest?.details && <p><strong>Details:</strong> {order.returnRequest.details}</p>}
                      {order.returnRequest?.requestedAt && (
                        <p><strong>Requested on:</strong> {new Date(order.returnRequest.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      )}
                      {order.returnRequest?.adminNote && <p><strong>Admin note:</strong> {order.returnRequest.adminNote}</p>}
                      {order.returnRequest?.refundAmount > 0 && (
                        <p><strong>Refund amount:</strong> Rs {order.returnRequest.refundAmount.toLocaleString('en-IN')}</p>
                      )}
                      {order.returnRequest?.refundId && <p><strong>Refund ID:</strong> {order.returnRequest.refundId}</p>}
                    </div>
                  </>
                ) : canRequestReturn ? (
                  <>
                    <h2 className="font-display text-2xl font-light mb-3">Eligible for return</h2>
                    <p className="font-sans text-sm text-mid-gray leading-relaxed">
                      This order is still inside the 7-day return window. Submit the issue below and the admin team can review the request and process the refund.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="font-display text-2xl font-light mb-3">Return window closed</h2>
                    <p className="font-sans text-sm text-mid-gray leading-relaxed">
                      Return requests are accepted for 7 days after delivery. This order is no longer eligible for a self-service return request.
                    </p>
                  </>
                )}
              </div>

              {canRequestReturn && (
                <form onSubmit={handleReturnRequest} className="w-full md:max-w-md space-y-4">
                  <Select
                    label="Reason"
                    options={RETURN_REASONS}
                    value={returnForm.reason}
                    onChange={(e) => setReturnForm((prev) => ({ ...prev, reason: e.target.value }))}
                  />
                  <Textarea
                    label="Details"
                    placeholder="Share what happened, including damage, packaging issues, or any mismatch."
                    value={returnForm.details}
                    onChange={(e) => setReturnForm((prev) => ({ ...prev, details: e.target.value }))}
                  />
                  <Button type="submit" variant="primary" loading={returnLoading} className="w-full">
                    <HiOutlineRefresh className="w-4 h-4" />
                    Request Return
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <p className="font-display text-lg font-light flex-shrink-0">Rs {(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}

            <div className="pt-4 space-y-2">
              {[
                ['Subtotal', order.itemsPrice],
                ['Shipping', order.shippingPrice],
                ['Tax (GST)', order.taxPrice],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between font-sans text-sm">
                  <span className="text-light-gray">{label}</span>
                  <span>{value === 0 ? 'Free' : `Rs ${value?.toLocaleString('en-IN')}`}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-beige pt-3">
                <span className="font-sans text-sm font-medium">Total</span>
                <span className="font-display text-xl">Rs {order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-beige p-5">
              <h3 className="font-sans text-xs tracking-widest uppercase text-mid-gray mb-4">Shipping Address</h3>
              <p className="font-sans text-sm leading-relaxed">
                <strong>{order.shippingAddress?.name}</strong><br />
                {order.shippingAddress?.phone}<br />
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
                {order.shippingAddress?.country}
              </p>
            </div>

            <div className="border border-beige p-5">
              <h3 className="font-sans text-xs tracking-widest uppercase text-mid-gray mb-4">Payment Info</h3>
              <div className="space-y-2 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-light-gray">Status</span>
                  <span className={paymentStatus.className}>{paymentStatus.label}</span>
                </div>
                {order.paymentInfo?.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-light-gray">Paid on</span>
                    <span className="text-xs">{new Date(order.paymentInfo.paidAt).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
                {order.paymentInfo?.refundedAt && (
                  <div className="flex justify-between">
                    <span className="text-light-gray">Refunded on</span>
                    <span className="text-xs">{new Date(order.paymentInfo.refundedAt).toLocaleDateString('en-IN')}</span>
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
