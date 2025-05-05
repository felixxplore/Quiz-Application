import { RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      navigate(user.role === "QUIZ_CREATOR" ? "/admin" : "/user");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Quiz App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Create and take quizzes with ease. Join now to start your learning
          journey!
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
