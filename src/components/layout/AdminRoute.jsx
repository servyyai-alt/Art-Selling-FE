import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}
