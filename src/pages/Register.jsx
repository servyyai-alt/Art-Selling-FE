import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { register, clearError } from '../redux/authSlice';
import { Input, Button } from '../components/ui/FormElement';
import ARTLogo from '../assets/ARTLOGO.jpeg';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    if (form.password !== form.confirm) {
      setValidationError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
  };

  const displayError = validationError || error;

  return (
    <>
      <Helmet><title>Create Account – ARTT</title></Helmet>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left */}
        <div className="hidden lg:block relative overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200"
            alt="Art"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-cream">
            <img
              src={ARTLogo}
              alt="Logo"
              className="h-14 w-14 md:h-16 md:w-16 rounded-full object-contain bg-white p-1"
            />
            <div className="mt-12 max-w-sm text-center">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">Join Us</p>
              <h2 className="font-display text-3xl font-light leading-snug">
                Become a collector of extraordinary art
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
              <img
                src={ARTLogo}
                alt="Logo"
                className="h-14 w-14 md:h-16 md:w-16 rounded-full object-contain bg-white p-1"
              />
            </div>

            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">New Account</p>
            <h1 className="font-display text-4xl font-light mb-2">Create Account</h1>
            <div className="w-10 h-px bg-gold mb-8" />

            {displayError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-sans text-sm mb-6"
              >
                {displayError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
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
                  placeholder="Min. 6 characters"
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
              <Input
                label="Confirm Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Repeat password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
              />

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Create Account
              </Button>
            </form>

            <p className="mt-8 text-center font-sans text-sm text-mid-gray">
              Already have an account?{' '}
              <Link to="/login" className="text-black border-b border-black hover:text-gold hover:border-gold transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}