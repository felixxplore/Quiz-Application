import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Bearer token for authenticated requests
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyM0BnbWFpbC5jb20iLCJyb2xlIjoiUVVJWl9DUkVBVE9SIiwiaWF0IjoxNzQ2MzYxNTE1LCJleHAiOjE3NDY0NDc5MTV9.G5CeXJnrzWKWm4PXQnhdy9wW0PDk5u6_MD-6s3bgVsQ";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
