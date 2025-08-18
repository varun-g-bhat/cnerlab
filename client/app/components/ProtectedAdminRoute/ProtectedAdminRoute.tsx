// // components/ProtectedRoute.tsx
// import React, { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import axios from "axios";
// import { toast } from "sonner"; // Assuming you use "sonner" for notifications

// // Define a type for role response
// interface RoleResponse {
//   role: string;
// }

// const ProtectedRoute: React.FC = () => {
//   const [role, setRole] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Fetch the role of the user
//   const fetchRole = async () => {
//     try {
//       const response = await axios.get<RoleResponse>(
//         "http://localhost:5050/api/v1/auth/isAdmin"
//       );
//       setRole(response.data.role); // Set the role
//     } catch (error) {
//       toast.error("Failed to fetch user role");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRole();
//   }, []);

//   // Check if the role is loaded and if the user is an admin
//   if (loading) {
//     return <div>Loading...</div>; // Optionally, a loading state
//   }

//   // Redirect to login page if not an admin
//   if (role !== "admin") {
//     return <Navigate to="/auth/login" />;
//   }

//   // Render the protected routes if the user is an admin
//   return <Outlet />;
// };

// export default ProtectedRoute;

import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from "react";
import type { RootState } from "@/store/store";

interface ProtectedRouteProps {
  children?: React.ReactElement;
}

const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const location = useLocation();

  const isAdmin = useSelector((state: RootState) => state.auth.role);

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  } else if (isAdmin !== "admin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedAdminRoute;
