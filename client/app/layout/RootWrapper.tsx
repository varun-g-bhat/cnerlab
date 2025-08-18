import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import api from "@/config/axiosInstance";
import { store } from "@/store/store";
import { persistLogin } from "@/store/auth/authSlice";

const RootWrapper = () => {
  useEffect(() => {
    const verifyUser = async () => {
      const response = await api.get("auth/verify");
      store.dispatch(persistLogin(response.data));
    };

    verifyUser();
  });

  return <Outlet />;
};

export default RootWrapper;
