// src/components/ProtectedRoute.tsx
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token && !!user;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
