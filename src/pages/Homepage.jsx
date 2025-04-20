import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Welcome to the Quiz App</h1>
      {token ? (
        <Link to="/dashboard" className="px-6 py-2 bg-blue-600 text-white rounded-md">
          Go to Dashboard
        </Link>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="px-6 py-2 bg-green-500 text-white rounded-md">
            Login
          </Link>
          <Link to="/signup" className="px-6 py-2 bg-blue-500 text-white rounded-md">
            Signup
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
