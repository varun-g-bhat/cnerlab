import type { signupUser } from "@/validation/userSchema";
import api from "@/config/axiosInstance";

export const signUp = async (data: signupUser) => {
  return api.post("/auth/signup", data);
};

export const verifyEmail = async (data: { otp: string | undefined }) => {
  return api.post("/auth/verify-email", data);
};

export const signIn = async (data: any) => {
  return api.post("/auth/signin", data);
};

export const logoutUser = async () => {
  return api.post("auth/logout");
};

export const getUserProfile = async () => {
  return api.get("/auth/profile");
};

export const updateUserProfile = async (data: any) => {
  return api.put("/auth/update-profile", data);
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
