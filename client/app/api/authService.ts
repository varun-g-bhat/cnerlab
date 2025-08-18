import type { signupUser } from "@/validation/userSchema";
import axios from "axios";

const BASE_URL = "https://cnerlab.onrender.com/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const signUp = async (data: signupUser) => {
  return apiClient.post("/auth/signup", data);
};

export const verifyEmail = async (data: { otp: string | undefined }) => {
  return apiClient.post("/auth/verify-email", data);
};

export const signIn = async (data: any) => {
  return apiClient.post("/auth/signin", data);
};

export const logoutUser = async () => {
  return apiClient.post("auth/logout");
};

// export const forgotPassword = async (data:{email: string}) => {
//     return apiClient.post('/auth/reset-password',data)
// }

// export const verifyUserEmail = async (verificationToken: string | undefined) => {
//   return apiClient.get(`/auth/verify-email/${verificationToken}`)
// }

// export const verifyResetToken = async (resetToken: string | undefined) => {
//     return apiClient.get(`/auth/verify-token/${resetToken}`)
// }

// export const resetPassword = async (data: ResetPasswordFormData, resetToken: string | undefined) => {
//   return apiClient.post(`/auth/reset-password/${resetToken}`, data)
// }
