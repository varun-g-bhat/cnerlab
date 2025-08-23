import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  role: null,
  userProfile: null,
  accessToken: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      // Persist token to localStorage
      if (action.payload) {
        localStorage.setItem("accessToken", action.payload);
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.role = null;
      state.userProfile = null;
      state.isLoggedIn = false;
      state.loading = false;
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
    },
    persistLogin: (state, action) => {
      state.user = action.payload.username;
      state.userProfile = action.payload.profile;
      state.role = action.payload.role;
      state.isLoggedIn = true;
      state.loading = false;
      // Persist role to localStorage
      if (action.payload.role) {
        localStorage.setItem("role", action.payload.role);
      }
    },
  },
});

export const { setAccessToken, logout, persistLogin } = authSlice.actions;

export default authSlice.reducer;
