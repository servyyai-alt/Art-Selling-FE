import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiArrowLeft, HiMail } from 'react-icons/hi';
import api from '../services/api';
import { Input, Button } from '../components/ui/FormElement';
import ARTTLogo from '../components/ui/ArtLogo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password – ARTT</title></Helmet>
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

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiMail className="w-8 h-8 text-gold" />
              </div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">Check Your Inbox</p>
              <h1 className="font-display text-3xl font-light mb-4">Email Sent</h1>
              <p className="font-sans text-sm text-mid-gray leading-relaxed mb-8">
                If an account with <strong>{email}</strong> exists, you'll receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn-outline inline-block">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">Password Recovery</p>
              <h1 className="font-display text-4xl font-light mb-2">Forgot Password</h1>
              <div className="w-10 h-px bg-gold mb-4" />
              <p className="font-sans text-sm text-mid-gray mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-sans text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                  Send Reset Link
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