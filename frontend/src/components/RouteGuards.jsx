import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function RequireUser({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="section text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
}
