import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
 
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome, {user?.name || "User"}!</p>
      <button onClick={handleLogout} className="px-6 py-2 bg-red-500 text-white rounded-md">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
