import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineHeart, HiMenu, HiX } from 'react-icons/hi';
import { logout } from '../../redux/authSlice';
import ARTTLogo from '../ui/ARTTLogo';
import ARTLogo from '../../assets/ARTLOGO.jpeg';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Artists', href: '/shop?filter=artists' },
  ];

  const navTextColor = scrolled
  ? 'text-black'
  : 'text-gold';

  const cartCount = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-luxury' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center">
  <img
    src={ARTLogo}
    alt="Logo"
    className="h-14 w-14 md:h-16 md:w-16 rounded-full object-contain bg-white p-1"
  />
</Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-sans text-xs tracking-widest uppercase transition-colors duration-200 ${
                location.pathname === link.href ? 'text-gold' : `${navTextColor} hover:text-gold`
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          {isAuthenticated && (
            <Link to="/orders" className="hidden md:block">
              <HiOutlineHeart className={`w-5 h-5 ${navTextColor} hover:text-gold transition-colors`} />
            </Link>
          )}

          <Link to="/cart" className="relative">
            <HiOutlineShoppingBag className={`w-5 h-5 ${navTextColor} hover:text-gold transition-colors`} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-black text-xs font-sans font-medium rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1"
            >
              <HiOutlineUser className={`w-5 h-5 ${navTextColor} hover:text-gold transition-colors`} />
            </button>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-8 w-48 bg-black text-cream shadow-luxury py-2 z-50"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-mid-gray">
                        <p className="font-sans text-xs text-light-gray uppercase tracking-widest">Signed in as</p>
                        <p className="font-sans text-sm truncate">{user?.name}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 font-sans text-xs tracking-widest uppercase hover:text-gold transition-colors">
                        Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 font-sans text-xs tracking-widest uppercase hover:text-gold transition-colors">
                        My Orders
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 font-sans text-xs tracking-widest uppercase text-gold hover:text-gold-light transition-colors">
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 font-sans text-xs tracking-widest uppercase hover:text-gold transition-colors border-t border-mid-gray mt-2"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 font-sans text-xs tracking-widest uppercase hover:text-gold transition-colors">
                        Sign In
                      </Link>
                      <Link to="/register" className="block px-4 py-2 font-sans text-xs tracking-widest uppercase hover:text-gold transition-colors">
                        Register
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black text-cream overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-sans text-sm tracking-widest uppercase hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-mid-gray pt-6 flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="font-sans text-sm tracking-widest uppercase hover:text-gold transition-colors">Profile</Link>
                    <Link to="/orders" className="font-sans text-sm tracking-widest uppercase hover:text-gold transition-colors">Orders</Link>
                    <button onClick={handleLogout} className="text-left font-sans text-sm tracking-widest uppercase hover:text-gold transition-colors">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="font-sans text-sm tracking-widest uppercase hover:text-gold transition-colors">Sign In</Link>
                    <Link to="/register" className="font-sans text-sm tracking-widest uppercase hover:text-gold transition-colors">Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}