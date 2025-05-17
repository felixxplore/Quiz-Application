import api from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "QUIZ_CREATOR";
  createdAt: string;
  enabled: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signupSuccess: boolean;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  signupSuccess: false,
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    data: {
      email: string;
      name: string;
      password: string;
      role: "QUIZ_CREATOR" | "ADMIN" | "USER";
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/signup", data);
      return response.data;
    } catch (error: any) {
      console.log("error come from signup : ", error);
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", data);
      return response.data;
    } catch (error: any) {
      console.log("error come from login : ", error.response.data);
      return rejectWithValue(error?.response?.data || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Optional: Call backend logout endpoint if implemented
      // await api.post("/auth/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    } catch (error: any) {
      console.error("Logout error:", error);
      return rejectWithValue("Logout failed");
    }
    return null;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearSignupSuccess: (state) => {
      state.signupSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.signupSuccess = true; // set flag on success
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.signupSuccess = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.signupSuccess = false;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.signupSuccess = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSignupSuccess } = authSlice.actions;
export default authSlice.reducer;
