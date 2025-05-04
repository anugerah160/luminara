// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const user = localStorage.getItem('token');

  // Kalau tidak ada token, redirect ke login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kalau ada token, render halaman yang diminta
  return children;
}
