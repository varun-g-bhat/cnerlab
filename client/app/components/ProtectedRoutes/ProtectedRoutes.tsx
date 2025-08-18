import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from "react";
import type { RootState } from "@/store/store";

interface ProtectedRouteProps {
  children?: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
