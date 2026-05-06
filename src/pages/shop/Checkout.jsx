import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiCheckCircle, HiOutlineLocationMarker, HiPlus } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { createOrder, createRazorpayOrder, verifyPayment } from '../../redux/ordersSlice';
import { clearCart } from '../../redux/cartSlice';
import { addUserAddress } from '../../redux/authSlice';
import { Input, Button } from '../../components/ui/FormElement';

const steps = ['Address', 'Review', 'Payment'];

const createBlankAddress = (user) => ({
  label: '',
  name: user?.name || '',
  phone: user?.phone || '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
});

const formatAddress = (address) => ({
  name: address.name,
  phone: address.phone,
  street: address.street,
  city: address.city,
  state: address.state,
  pincode: address.pincode,
  country: address.country || 'India',
});

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.orders);

  const savedAddresses = user?.addresses || [];
  const defaultAddress = savedAddresses.find((address) => address.isDefault) || savedAddresses[0] || null;

  const [step, setStep] = useState(0);
  const [addressMode, setAddressMode] = useState(defaultAddress ? 'saved' : 'new');
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?._id || '');
  const [saveNewAddress, setSaveNewAddress] = useState(savedAddresses.length === 0);
  const [newAddressIsDefault, setNewAddressIsDefault] = useState(savedAddresses.length === 0);
  const [savingAddress, setSavingAddress] = useState(false);
  const [address, setAddress] = useState(createBlankAddress(user));

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [step]);

  useEffect(() => {
    const latestDefault = (user?.addresses || []).find((item) => item.isDefault) || user?.addresses?.[0] || null;
    if (latestDefault) {
      setSelectedAddressId((prev) => prev || latestDefault._id);
      if (addressMode !== 'new') setAddressMode('saved');
    } else {
      setAddressMode('new');
      setSelectedAddressId('');
    }
    setAddress((prev) => ({
      ...prev,
      name: prev.name || user?.name || '',
      phone: prev.phone || user?.phone || '',
    }));
  }, [user]);

  const shippingPrice = totalPrice >= 50000 ? 0 : 500;
  const gst = Math.round(totalPrice * 0.18);
  const orderTotal = totalPrice + shippingPrice + gst;

  const selectedSavedAddress = useMemo(
    () => savedAddresses.find((item) => item._id === selectedAddressId) || defaultAddress,
    [savedAddresses, selectedAddressId, defaultAddress]
  );

  const activeAddress = addressMode === 'saved'
    ? selectedSavedAddress
    : formatAddress(address);

  const validateAddress = (addressToValidate) => {
    const requiredFields = ['name', 'phone', 'street', 'city', 'state', 'pincode'];
    return requiredFields.every((field) => addressToValidate?.[field]);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    if (addressMode === 'saved') {
      if (!selectedSavedAddress) {
        toast.error('Please choose a saved address');
        return;
      }
      setStep(1);
      return;
    }

    if (!validateAddress(address)) {
      toast.error('Please fill all address fields');
      return;
    }

    if (saveNewAddress) {
      setSavingAddress(true);
      const result = await dispatch(addUserAddress({ ...address, isDefault: newAddressIsDefault }));
      setSavingAddress(false);

      if (result.error) {
        toast.error(result.payload || 'Failed to save address');
        return;
      }

      const saved = result.payload?.addresses?.find((item) =>
        item.street === address.street
        && item.city === address.city
        && item.pincode === address.pincode
        && item.phone === address.phone
      );

      if (saved?._id) {
        setSelectedAddressId(saved._id);
        setAddressMode('saved');
      }
      toast.success('Address saved to your account');
    }

    setStep(1);
  };

  const initiatePayment = async () => {
    const shippingAddress = formatAddress(activeAddress);

    if (!validateAddress(shippingAddress)) {
      toast.error('Please complete your shipping address');
      setStep(0);
      return;
    }

    try {
      const razorRes = await dispatch(createRazorpayOrder(orderTotal)).unwrap();

      const options = {
        key: razorRes.key,
        amount: razorRes.order.amount,
        currency: 'INR',
        name: 'ARTT',
        description: 'Art Purchase',
        order_id: razorRes.order.id,
        prefill: { name: shippingAddress.name, contact: shippingAddress.phone, email: user?.email },
        theme: { color: '#C9A34E' },
        handler: async (response) => {
          try {
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
              shippingAddress,
              itemsPrice: totalPrice,
              shippingPrice,
              taxPrice: gst,
              totalPrice: orderTotal,
            })).unwrap();

            await dispatch(verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: newOrder._id,
            })).unwrap();

            await dispatch(clearCart());
            navigate(`/order-success/${newOrder._id}`);
          } catch {
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

  // const handleBack = () => {
  //   if (step > 0) {
  //     setStep((prev) => prev - 1);
  //   } else {
  //     navigate(-1); // go back to previous page
  //   }
  // };

  return (
    <>
      <Helmet><title>Checkout - ARTT</title></Helmet>
      <div className="pt-24 pb-20 max-w-6xl mx-auto px-6">
        <div className="py-8 mb-6">
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Final Step</p>
          <h1 className="font-display text-5xl font-light">Checkout</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

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
          <div className="lg:col-span-2">
            {step === 0 && (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleAddressSubmit} className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-light mb-2">Shipping Address</h2>
                  <p className="font-sans text-sm text-light-gray">
                    Choose a saved address for a faster checkout or add a fresh delivery location for this order.
                  </p>
                  <div className="w-8 h-px bg-gold mt-4" />
                </div>

                {savedAddresses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setAddressMode('saved')}
                      className={`text-left border p-4 transition-colors ${
                        addressMode === 'saved' ? 'border-black bg-beige/30' : 'border-beige hover:border-gold'
                      }`}
                    >
                      <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Saved Address</p>
                      <p className="font-display text-xl font-light">Use Existing</p>
                      <p className="font-sans text-sm text-light-gray mt-2">Pick from the addresses already saved in your profile.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressMode('new')}
                      className={`text-left border p-4 transition-colors ${
                        addressMode === 'new' ? 'border-black bg-beige/30' : 'border-beige hover:border-gold'
                      }`}
                    >
                      <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">New Address</p>
                      <p className="font-display text-xl font-light">Add New</p>
                      <p className="font-sans text-sm text-light-gray mt-2">Use a different delivery address for this order.</p>
                    </button>
                  </div>
                )}

                {addressMode === 'saved' && savedAddresses.length > 0 ? (
                  <div className="space-y-4">
                    {savedAddresses.map((saved) => (
                      <button
                        key={saved._id}
                        type="button"
                        onClick={() => setSelectedAddressId(saved._id)}
                        className={`w-full text-left border p-5 transition-colors ${
                          selectedAddressId === saved._id ? 'border-black bg-beige/30' : 'border-beige hover:border-gold'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              {saved.label && (
                                <span className="font-sans text-xs tracking-widest uppercase text-mid-gray border border-beige px-2 py-0.5">
                                  {saved.label}
                                </span>
                              )}
                              {saved.isDefault && (
                                <span className="font-sans text-xs tracking-widest uppercase text-gold border border-gold/30 px-2 py-0.5">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="font-sans text-sm font-medium">{saved.name}</p>
                            <p className="font-sans text-sm text-mid-gray">{saved.phone}</p>
                            <p className="font-sans text-sm text-mid-gray mt-2">
                              {saved.street}, {saved.city}, {saved.state} - {saved.pincode}
                            </p>
                            <p className="font-sans text-sm text-mid-gray">{saved.country}</p>
                          </div>
                          {selectedAddressId === saved._id && (
                            <HiCheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5 border border-beige p-5">
                    <div className="flex items-center gap-2">
                      <HiPlus className="w-5 h-5 text-gold" />
                      <p className="font-sans text-xs tracking-widest uppercase text-gold">Enter New Address</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="Full Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} required />
                      <Input label="Phone Number" type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
                    </div>
                    <Input label="Address Label" value={address.label} onChange={(e) => setAddress({ ...address, label: e.target.value })} placeholder="Home, Office, Studio" />
                    <Input label="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required placeholder="House no., Street, Area" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                      <Input label="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required maxLength={6} />
                      <Input label="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="flex items-center gap-3 font-sans text-sm text-mid-gray">
                        <input
                          type="checkbox"
                          checked={saveNewAddress}
                          onChange={(e) => setSaveNewAddress(e.target.checked)}
                          className="w-4 h-4 accent-black"
                        />
                        Save this address to my account
                      </label>
                      {saveNewAddress && (
                        <label className="flex items-center gap-3 font-sans text-sm text-mid-gray">
                          <input
                            type="checkbox"
                            checked={newAddressIsDefault}
                            onChange={(e) => setNewAddressIsDefault(e.target.checked)}
                            className="w-4 h-4 accent-black"
                          />
                          Make this my default address for future orders
                        </label>
                      )}
                    </div>
                  </div>
                )}
              <div className="flex gap-3">
                {/* <Button variant="primary" size="lg" className="mt-4" onClick={handleBack}>
                  ← Back
                </Button> */}

                <Button type="submit" variant="primary" size="lg" className="mt-4" loading={savingAddress}>
                  Continue to Review
                </Button>
                </div>
              </motion.form>
            )}

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
                          <p className="font-display text-lg font-light">Rs { (item.price * item.quantity).toLocaleString('en-IN') }</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-beige/40 p-5 mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <HiOutlineLocationMarker className="w-4 h-4 text-gold" />
                    <h3 className="font-sans text-xs tracking-widest uppercase text-mid-gray">Delivering To</h3>
                  </div>
                  <p className="font-sans text-sm"><strong>{activeAddress?.name}</strong> - {activeAddress?.phone}</p>
                  <p className="font-sans text-sm text-mid-gray">
                    {activeAddress?.street}, {activeAddress?.city}, {activeAddress?.state} - {activeAddress?.pincode}
                  </p>
                  <p className="font-sans text-sm text-mid-gray">{activeAddress?.country}</p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)}>Edit Address</Button>
                  <Button variant="primary" onClick={() => setStep(2)}>Proceed to Payment</Button>
                </div>
              </motion.div>
            )}

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
                    Pay Rs {orderTotal.toLocaleString('en-IN')}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-dark-gray text-cream p-8 h-fit">
            <h3 className="font-display text-xl font-light mb-6">Summary</h3>
            <div className="space-y-3 font-sans text-sm">
              <div className="flex justify-between"><span className="text-light-gray">Subtotal</span><span>Rs {totalPrice.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-light-gray">Shipping</span><span>{shippingPrice === 0 ? <span className="text-gold">Free</span> : `Rs ${shippingPrice}`}</span></div>
              <div className="flex justify-between"><span className="text-light-gray">GST (18%)</span><span>Rs {gst.toLocaleString('en-IN')}</span></div>
              <div className="border-t border-mid-gray pt-3 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-display text-xl">Rs {orderTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
