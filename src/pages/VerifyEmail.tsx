import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const status = params.get("status");
  const message = params.get("message") || "Unknown error";

  useEffect(() => {
    if (status === "success") {
      toast.success(message || "Your email is verified!", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      toast.error(`Email verification failed: ${message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }, [status, message, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`p-4 rounded-md shadow-md ${
          status === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {status === "success"
          ? "Your email is verified!"
          : `Email verification failed: ${message}`}
      </div>
      <ToastContainer />
    </div>
  );
};

export default VerifyEmail;
