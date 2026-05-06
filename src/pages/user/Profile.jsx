import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HiOutlineUser,
  HiOutlineKey,
  HiOutlineLocationMarker,
  HiOutlineTrash,
  HiPlus,
  HiEye,
  HiEyeOff,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import {
  updateProfile,
  changePassword,
  addUserAddress,
  deleteUserAddress,
  setDefaultAddress,
} from '../../redux/authSlice';
import { Input, Button } from '../../components/ui/FormElement';

const tabs = [
  { id: 'profile', label: 'Personal Info', icon: HiOutlineUser },
  { id: 'password', label: 'Password', icon: HiOutlineKey },
  { id: 'addresses', label: 'Addresses', icon: HiOutlineLocationMarker },
];

const createAddressForm = (user, hasAddresses = false) => ({
  label: '',
  name: user?.name || '',
  phone: user?.phone || '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  isDefault: !hasAddresses,
});

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [defaultingAddressId, setDefaultingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(createAddressForm(user, user?.addresses?.length > 0));
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    setProfileForm({ name: user?.name || '', phone: user?.phone || '' });
    setAddressForm(createAddressForm(user, user?.addresses?.length > 0));
  }, [user]);

  const resetAddressForm = () => {
    setAddressForm(createAddressForm(user, user?.addresses?.length > 0));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const result = await dispatch(updateProfile(profileForm));
    setProfileLoading(false);
    if (!result.error) toast.success('Profile updated successfully');
    else toast.error(result.payload || 'Update failed');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setPassLoading(true);
    const result = await dispatch(changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    }));
    setPassLoading(false);
    if (!result.error) {
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
    } else {
      toast.error(result.payload || 'Failed to change password');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    const result = await dispatch(addUserAddress(addressForm));
    setAddressLoading(false);

    if (!result.error) {
      toast.success('Address saved successfully');
      setShowAddressForm(false);
      resetAddressForm();
    } else {
      toast.error(result.payload || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    setDeletingAddressId(addressId);
    const result = await dispatch(deleteUserAddress(addressId));
    setDeletingAddressId(null);

    if (!result.error) toast.success('Address removed');
    else toast.error(result.payload || 'Failed to remove address');
  };

  const handleSetDefaultAddress = async (addressId) => {
    setDefaultingAddressId(addressId);
    const result = await dispatch(setDefaultAddress(addressId));
    setDefaultingAddressId(null);

    if (!result.error) toast.success('Default address updated');
    else toast.error(result.payload || 'Failed to update default address');
  };

  return (
    <>
      <Helmet><title>My Profile - ARTT</title></Helmet>
      <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
        <div className="py-8">
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Account</p>
          <h1 className="font-display text-5xl font-light">My Profile</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

        <div className="flex items-center gap-5 mb-10 p-6 bg-dark-gray text-cream">
          <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-2xl font-light text-gold">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-display text-2xl font-light">{user?.name}</h2>
            <p className="font-sans text-sm text-light-gray">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="font-sans text-xs tracking-widest uppercase text-gold border border-gold/30 px-2 py-0.5 mt-1 inline-block">Admin</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-sans text-xs tracking-widest uppercase transition-colors ${
                    activeTab === id ? 'bg-black text-cream' : 'text-mid-gray hover:text-black hover:bg-beige/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <h2 className="font-display text-2xl font-light mb-6">Personal Information</h2>
                  <Input
                    label="Full Name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-mid-gray mb-2">Email Address</label>
                    <input
                      value={user?.email || ''}
                      disabled
                      className="w-full border border-beige bg-beige/30 px-4 py-3 font-sans text-sm text-light-gray cursor-not-allowed"
                    />
                    <p className="font-sans text-xs text-light-gray mt-1">Email cannot be changed</p>
                  </div>
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 9999999999"
                  />
                  <Button type="submit" variant="primary" loading={profileLoading}>Save Changes</Button>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <h2 className="font-display text-2xl font-light mb-6">Change Password</h2>
                  {[
                    ['current', 'Current Password', passwordForm.currentPassword],
                    ['new', 'New Password', passwordForm.newPassword],
                    ['confirm', 'Confirm New Password', passwordForm.confirm],
                  ].map(([key, label, value]) => (
                    <div key={key} className="relative">
                      <Input
                        label={label}
                        type={showPassword[key] ? 'text' : 'password'}
                        value={value}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [key === 'current' ? 'currentPassword' : key === 'new' ? 'newPassword' : 'confirm']: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }))}
                        className="absolute right-4 top-[38px] text-mid-gray hover:text-black"
                      >
                        {showPassword[key] ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                  <Button type="submit" variant="primary" loading={passLoading}>Change Password</Button>
                </form>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="font-display text-2xl font-light">Saved Addresses</h2>
                      <p className="font-sans text-sm text-light-gray mt-1">
                        Add delivery addresses here and choose your default for faster checkout.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant={showAddressForm ? 'outline' : 'primary'}
                      onClick={() => {
                        if (showAddressForm) resetAddressForm();
                        setShowAddressForm((prev) => !prev);
                      }}
                    >
                      <HiPlus className="w-4 h-4" />
                      {showAddressForm ? 'Close Form' : 'Add Address'}
                    </Button>
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddressSubmit} className="border border-beige p-5 mb-6 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Address Label"
                          value={addressForm.label}
                          onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                          placeholder="Home, Office, Studio"
                        />
                        <label className="flex items-center gap-3 pt-7 font-sans text-sm text-mid-gray">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                            className="w-4 h-4 accent-black"
                          />
                          Make this my default address
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Full Name"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          required
                        />
                        <Input
                          label="Phone Number"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          required
                        />
                      </div>

                      <Input
                        label="Street Address"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        required
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="City"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        />
                        <Input
                          label="State"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Pincode"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          required
                        />
                        <Input
                          label="Country"
                          value={addressForm.country}
                          onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                          required
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button type="submit" variant="primary" loading={addressLoading}>Save Address</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            resetAddressForm();
                            setShowAddressForm(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}

                  {user?.addresses?.length === 0 ? (
                    <div className="text-center py-16 border border-beige">
                      <HiOutlineLocationMarker className="w-10 h-10 text-light-gray mx-auto mb-3" />
                      <p className="font-sans text-sm text-light-gray">No saved addresses</p>
                      <p className="font-sans text-xs text-light-gray mt-1">Add your first address to speed up future orders</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.addresses.map((addr) => (
                        <div key={addr._id} className="border border-beige p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                {addr.label && (
                                  <span className="font-sans text-xs tracking-widest uppercase text-mid-gray border border-beige px-2 py-0.5">
                                    {addr.label}
                                  </span>
                                )}
                                {addr.isDefault && (
                                  <span className="font-sans text-xs tracking-widest uppercase text-gold border border-gold/30 px-2 py-0.5">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="font-sans text-sm font-medium">{addr.name}</p>
                              <p className="font-sans text-sm text-mid-gray mb-2">{addr.phone}</p>
                              <p className="font-sans text-sm leading-relaxed">
                                {addr.street}, {addr.city}, {addr.state} - {addr.pincode}<br />
                                {addr.country}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!addr.isDefault && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  loading={defaultingAddressId === addr._id}
                                  onClick={() => handleSetDefaultAddress(addr._id)}
                                >
                                  Make Default
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                loading={deletingAddressId === addr._id}
                                onClick={() => handleDeleteAddress(addr._id)}
                              >
                                <HiOutlineTrash className="w-4 h-4" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
