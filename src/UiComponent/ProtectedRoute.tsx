import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactElement;
  allowedRole: "QUIZ_CREATOR" | "USER";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  allowedRole,
}) => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
