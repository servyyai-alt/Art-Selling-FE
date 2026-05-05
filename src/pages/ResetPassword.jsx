import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiArrowLeft, HiCheckCircle, HiEye, HiEyeOff } from 'react-icons/hi';
import api from '../services/api';
import { Input, Button } from '../components/ui/FormElement';
import ARTTLogo from '../components/ui/ArtLogo';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Reset Password - ARTT</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-cream px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 flex justify-center">
            <ARTTLogo />
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiCheckCircle className="w-8 h-8 text-gold" />
              </div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">Password Updated</p>
              <h1 className="font-display text-3xl font-light mb-4">All Set</h1>
              <p className="font-sans text-sm text-mid-gray leading-relaxed mb-8">
                Your password has been reset successfully. Redirecting you to sign in.
              </p>
              <Link to="/login" className="btn-outline inline-block">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">Secure Access</p>
              <h1 className="font-display text-4xl font-light mb-2">Reset Password</h1>
              <div className="w-10 h-px bg-gold mb-4" />
              <p className="font-sans text-sm text-mid-gray mb-8">
                Choose a new password for your ARTT account.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-sans text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 bottom-3 text-light-gray hover:text-black transition-colors"
                  >
                    {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your new password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((value) => !value)}
                    className="absolute right-3 bottom-3 text-light-gray hover:text-black transition-colors"
                  >
                    {showConfirm ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                  </button>
                </div>

                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                  Save New Password
                </Button>
              </form>

              <Link
                to="/login"
                className="mt-6 flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-light-gray hover:text-black transition-colors justify-center"
              >
                <HiArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
