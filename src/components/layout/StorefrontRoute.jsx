import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function StorefrontRoute({ children }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
