import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signUpuser } from "./authThunks";

const initialState = {
  user: null,
  loading: false,
  error: null,
  signupSuccess: false,
};

const authSlide = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signUpuser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpuser.fulfilled, (state, action) => {
        state.loading = false;
        state.signupSuccess = true;
      })
      .addCase(signUpuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlide.actions;
export default authSlide.reducer;
