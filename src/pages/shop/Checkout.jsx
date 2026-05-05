import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { createOrder, createRazorpayOrder, verifyPayment } from '../../redux/ordersSlice';
import { clearCart } from '../../redux/cartSlice';
import { Input, Button } from '../../components/ui/FormElement';

const steps = ['Address', 'Review', 'Payment'];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.orders);

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const shippingPrice = totalPrice >= 50000 ? 0 : 500;
  const gst = Math.round(totalPrice * 0.18);
  const orderTotal = totalPrice + shippingPrice + gst;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { name, phone, street, city, state, pincode } = address;
    if (!name || !phone || !street || !city || !state || !pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    setStep(1);
  };

  const initiatePayment = async () => {
    try {
      // 1. Create Razorpay order
      const razorRes = await dispatch(createRazorpayOrder(orderTotal)).unwrap();

      // 2. Open Razorpay modal
      const options = {
        key: razorRes.key,
        amount: razorRes.order.amount,
        currency: 'INR',
        name: 'ARTT',
        description: 'Art Purchase',
        order_id: razorRes.order.id,
        prefill: { name: address.name, contact: address.phone, email: user?.email },
        theme: { color: '#C9A34E' },
        handler: async (response) => {
          try {
            // 3. Create order in DB
            const orderItems = items.map((item) => ({
              product: item.product._id,
              title: item.product.title,
              artist: item.product.artist,
              image: item.product.images?.[0]?.url,
              price: item.price,
              quantity: item.quantity,
            }));
            const newOrder = await dispatch(createOrder({
              orderItems,
              shippingAddress: address,
              itemsPrice: totalPrice,
              shippingPrice,
              taxPrice: gst,
              totalPrice: orderTotal,
            })).unwrap();

            // 4. Verify payment
            await dispatch(verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: newOrder._id,
            })).unwrap();

            await dispatch(clearCart());
            navigate(`/order-success/${newOrder._id}`);
          } catch (err) {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: { ondismiss: () => toast.error('Payment cancelled') },
      };

      if (!window.Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh.');
        return;
      }
      const rp = new window.Razorpay(options);
      rp.open();
    } catch (err) {
      toast.error(err || 'Could not initiate payment');
    }
  };

  return (
    <>
      <Helmet><title>Checkout – ARTT</title></Helmet>
      <div className="pt-24 pb-20 max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="py-8 mb-6">
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Final Step</p>
          <h1 className="font-display text-5xl font-light">Checkout</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-0 mb-12">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-medium transition-colors ${
                  i < step ? 'bg-gold text-black' : i === step ? 'bg-black text-cream' : 'bg-beige text-light-gray'
                }`}>
                  {i < step ? <HiCheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`font-sans text-xs tracking-widest uppercase ${i === step ? 'text-black' : 'text-light-gray'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-4 ${i < step ? 'bg-gold' : 'bg-beige'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main panel */}
          <div className="lg:col-span-2">

            {/* Step 0 – Address */}
            {step === 0 && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleAddressSubmit}
                className="space-y-5"
              >
                <h2 className="font-display text-2xl font-light mb-2">Shipping Address</h2>
                <div className="w-8 h-px bg-gold mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input label="Full Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} required />
                  <Input label="Phone Number" type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
                </div>
                <Input label="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required placeholder="House no., Street, Area" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                  <Input label="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input label="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required maxLength={6} />
                  <Input label="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
                </div>
                <Button type="submit" variant="primary" size="lg" className="mt-4">Continue to Review</Button>
              </motion.form>
            )}

            {/* Step 1 – Review */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-2xl font-light mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-8">
                  {items.map((item) => {
                    const p = item.product;
                    if (!p) return null;
                    return (
                      <div key={p._id} className="flex gap-4 border-b border-beige pb-4">
                        <img
                          src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=200'}
                          alt={p.title}
                          className="w-16 h-20 object-cover bg-beige flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-xs text-gold uppercase tracking-widest">{p.artist}</p>
                          <p className="font-display text-lg font-light">{p.title}</p>
                          <p className="font-sans text-xs text-light-gray">{p.medium}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-sans text-xs text-light-gray">Qty: {item.quantity}</p>
                          <p className="font-display text-lg font-light">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Address summary */}
                <div className="bg-beige/40 p-5 mb-8">
                  <h3 className="font-sans text-xs tracking-widest uppercase text-mid-gray mb-3">Delivering To</h3>
                  <p className="font-sans text-sm"><strong>{address.name}</strong> · {address.phone}</p>
                  <p className="font-sans text-sm text-mid-gray">{address.street}, {address.city}, {address.state} – {address.pincode}</p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)}>Edit Address</Button>
                  <Button variant="primary" onClick={() => setStep(2)}>Proceed to Payment</Button>
                </div>
              </motion.div>
            )}

            {/* Step 2 – Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-2xl font-light mb-6">Payment</h2>
                <div className="border border-beige p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full bg-gold flex-shrink-0" />
                    <span className="font-sans text-sm font-medium">Razorpay (Cards, UPI, NetBanking, Wallets)</span>
                  </div>
                  <p className="font-sans text-xs text-light-gray">
                    You will be redirected to Razorpay's secure payment page. We accept Visa, Mastercard, UPI, and all major Indian banks.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="gold" loading={loading} onClick={initiatePayment} size="lg">
                    Pay ₹{orderTotal.toLocaleString('en-IN')}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="bg-dark-gray text-cream p-8 h-fit">
            <h3 className="font-display text-xl font-light mb-6">Summary</h3>
            <div className="space-y-3 font-sans text-sm">
              <div className="flex justify-between"><span className="text-light-gray">Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-light-gray">Shipping</span><span>{shippingPrice === 0 ? <span className="text-gold">Free</span> : `₹${shippingPrice}`}</span></div>
              <div className="flex justify-between"><span className="text-light-gray">GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
              <div className="border-t border-mid-gray pt-3 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-display text-xl">₹{orderTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
