import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { login, clearError } from '../redux/authSlice';
import { Input, Button } from '../components/ui/FormElement';
import ARTLogo from '../assets/ARTLOGO.jpeg';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
    return () => dispatch(clearError());
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <>
      <Helmet><title>Sign In – ARTT</title></Helmet>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left – art panel */}
        <div className="hidden lg:block relative overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200"
            alt="Art"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-cream">
            {/* <ARTTLogo size="lg" light /> */}
               <img
                  src={ARTLogo}
                  alt="Logo"
                  className="h-14 w-14 md:h-16 md:w-16 rounded-full object-contain bg-white p-1"
                />
            <div className="mt-12 max-w-sm text-center">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">Welcome Back</p>
              <h2 className="font-display text-3xl font-light leading-snug">
                Continue your journey through art
              </h2>
              <div className="w-12 h-px bg-gold mx-auto mt-6" />
            </div>
          </div>
        </div>

        {/* Right – form */}
        <div className="flex items-center justify-center px-6 py-20 bg-cream">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden mb-10 flex justify-center">
              {/* <ARTTLogo /> */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img
                  src={ARTLogo}
                  alt="Logo"
                  className="h-14 w-14 md:h-16 md:w-16 rounded-full object-contain bg-white p-1"
                />
              </Link>
            </div>

            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">Account</p>
            <h1 className="font-display text-4xl font-light mb-2">Sign In</h1>
            <div className="w-10 h-px bg-gold mb-8" />

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-sans text-sm mb-6"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 bottom-3 text-light-gray hover:text-black transition-colors"
                >
                  {showPass ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="font-sans text-xs tracking-widest uppercase text-light-gray hover:text-gold transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Sign In
              </Button>
            </form>

            <p className="mt-8 text-center font-sans text-sm text-mid-gray">
              New to ARTT?{' '}
              <Link to="/register" className="text-black border-b border-black hover:text-gold hover:border-gold transition-colors">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}