import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './redux/authSlice';
import { fetchCart, resetCartState } from './redux/cartSlice';
import { fetchWishlist, resetWishlistState } from './redux/wishlistSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import ScrollToTop from './components/layout/ScrollToTop';
import StorefrontRoute from './components/layout/StorefrontRoute';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/shop/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/shop/OrderSuccess'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AddEditProduct = lazy(() => import('./pages/admin/AddEditProduct'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'));

export default function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (!token || !user) {
      dispatch(resetCartState());
      dispatch(resetWishlistState());
      return;
    }

    if (user.role === 'admin') {
      dispatch(resetCartState());
      dispatch(resetWishlistState());
      return;
    }

    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch, token, user]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<Loader fullScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<StorefrontRoute><Cart /></StorefrontRoute>} />
              <Route path="/wishlist" element={<StorefrontRoute><ProtectedRoute><Wishlist /></ProtectedRoute></StorefrontRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<StorefrontRoute><ProtectedRoute><Checkout /></ProtectedRoute></StorefrontRoute>} />
              <Route path="/order-success/:id" element={<StorefrontRoute><ProtectedRoute><OrderSuccess /></ProtectedRoute></StorefrontRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/orders" element={<StorefrontRoute><ProtectedRoute><OrderHistory /></ProtectedRoute></StorefrontRoute>} />
              <Route path="/orders/:id" element={<StorefrontRoute><ProtectedRoute><OrderDetail /></ProtectedRoute></StorefrontRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/products/new" element={<AdminRoute><AddEditProduct /></AdminRoute>} />
              <Route path="/admin/products/:id/edit" element={<AdminRoute><AddEditProduct /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
