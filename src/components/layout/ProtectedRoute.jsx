import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useSelector((s) => s.auth);
  if (!isAuthenticated && !token) return <Navigate to="/login" replace />;
  return children;
}