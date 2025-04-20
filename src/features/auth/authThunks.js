import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Login Failed");
    }
  }
);

export const signUpuser = createAsyncThunk(
  "auth/signup",
  async ({ email, password, role, name }, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Signup Failed");
    }
  }
);
