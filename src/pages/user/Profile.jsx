import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiOutlineUser, HiOutlineKey, HiOutlineLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { updateProfile, changePassword } from '../../redux/authSlice';
import { Input, Button } from '../../components/ui/FormElement';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const tabs = [
  { id: 'profile', label: 'Personal Info', icon: HiOutlineUser },
  { id: 'password', label: 'Password', icon: HiOutlineKey },
  { id: 'addresses', label: 'Addresses', icon: HiOutlineLocationMarker },
];

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
          current: false,
          new: false,
          confirm: false,
        });
  
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

  return (
    <>
      <Helmet><title>My Profile – ARTT</title></Helmet>
      <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
        <div className="py-8">
          <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Account</p>
          <h1 className="font-display text-5xl font-light">My Profile</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>

        {/* User summary */}
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
          {/* Sidebar */}
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

          {/* Content */}
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
                      value={user?.email}
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
                  {/* <Input
                    label="Current Password"
                    type={showPass ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  /> */}
                  <div className="relative">
                    <Input
                      label="Current Password"
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      required
                    />
                  
                    <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({ ...prev, current: !prev.current }))
                        }
                        className="absolute right-4 top-[38px] text-mid-gray hover:text-black"
                      >
                        {showPassword.current ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                   <Input
                     label="New Password"
                     type={showPassword.new ? 'text' : 'password'}
                     value={passwordForm.newPassword}
                     onChange={(e) =>
                       setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                     }
                     required
                   />
                 
                   <button
                     type="button"
                     onClick={() =>
                       setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                     }
                     className="absolute right-4 top-[38px] text-mid-gray hover:text-black"
                   >
                     {showPassword.new ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                   </button>
                 </div>
                  <div className="relative">
                    <Input
                      label="Confirm New Password"
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordForm.confirm}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirm: e.target.value })
                      }
                      required
                    />
                  
                    <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
                        }
                        className="absolute right-4 top-[38px] text-mid-gray hover:text-black"
                      >
                        {showPassword.confirm ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button type="submit" variant="primary" loading={passLoading}>Change Password</Button>
                </form>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="font-display text-2xl font-light mb-6">Saved Addresses</h2>
                  {user?.addresses?.length === 0 ? (
                    <div className="text-center py-16 border border-beige">
                      <HiOutlineLocationMarker className="w-10 h-10 text-light-gray mx-auto mb-3" />
                      <p className="font-sans text-sm text-light-gray">No saved addresses</p>
                      <p className="font-sans text-xs text-light-gray mt-1">Addresses are saved during checkout</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user?.addresses?.map((addr) => (
                        <div key={addr._id} className="border border-beige p-5">
                          {addr.isDefault && (
                            <span className="font-sans text-xs tracking-widest uppercase text-gold border border-gold/30 px-2 py-0.5 mb-3 inline-block">Default</span>
                          )}
                          <p className="font-sans text-sm leading-relaxed">
                            {addr.street}, {addr.city}, {addr.state} – {addr.pincode}<br />
                            {addr.country}
                          </p>
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