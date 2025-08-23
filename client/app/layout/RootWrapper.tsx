import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import api from "@/config/axiosInstance";
import { store } from "@/store/store";
import { persistLogin, logout, setAccessToken } from "@/store/auth/authSlice";

const RootWrapper = () => {
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a stored access token
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          // Set the token in the store
          store.dispatch(setAccessToken(storedToken));

          // Verify the token is still valid
          const response = await api.get("auth/verify");
          store.dispatch(persistLogin(response.data));
        } else {
          // No token found, ensure user is logged out
          store.dispatch(logout());
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        // Token is invalid, clear everything
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        store.dispatch(logout());
      }
    };

    initializeAuth();
  }, []); // Add dependency array to prevent infinite calls

  return <Outlet />;
};

export default RootWrapper;
