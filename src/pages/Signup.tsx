import { clearSignupSuccess, signup } from "@/store/authSlice";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Role = "USER" | "QUIZ_CREATOR" | "ADMIN";

interface FormData {
  email: string;
  name: string;
  password: string;
  role: Role;
}

const Signup: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { signupSuccess, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    password: "",
    role: "USER", //* set a default value
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(signup(formData)).unwrap();
      toast.success("Signup successful! Please login.");
    } catch (error) {
      toast.error("Signup failed: " + (error || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (signupSuccess) {
      toast.success(
        "User registered successfully! Please check your email for the verification link or contact support if not received.",
        { autoClose: 5000 }
      );
      dispatch(clearSignupSuccess());
      navigate("/login");
    }
    if (error) {
      toast.error("Signup failed: " + error);
    }
  }, [signupSuccess, error, dispatch, navigate]);

  return (
    // <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
    //     <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
    //       Sign Up
    //     </h2>
    //     <form onSubmit={handleSubmit} className="space-y-6">
    //       <div>
    //         <label
    //           htmlFor="email"
    //           className="block text-sm font-medium text-gray-700"
    //         >
    //           Email
    //         </label>
    //         <input
    //           id="email"
    //           name="email"
    //           type="email"
    //           value={formData.email}
    //           onChange={handleChange}
    //           required
    //           className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    //           placeholder="Enter your email"
    //         />
    //       </div>
    //       <div>
    //         <label
    //           htmlFor="name"
    //           className="block text-sm font-medium text-gray-700"
    //         >
    //           Name
    //         </label>
    //         <input
    //           id="name"
    //           name="name"
    //           type="text"
    //           value={formData.name}
    //           onChange={handleChange}
    //           required
    //           className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    //           placeholder="Enter your name"
    //         />
    //       </div>
    //       <div>
    //         <label
    //           htmlFor="password"
    //           className="block text-sm font-medium text-gray-700"
    //         >
    //           Password
    //         </label>
    //         <input
    //           id="password"
    //           name="password"
    //           type="password"
    //           value={formData.password}
    //           onChange={handleChange}
    //           required
    //           className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    //           placeholder="Enter your password"
    //         />
    //       </div>
    //       <div>
    //         <label
    //           htmlFor="role"
    //           className="block text-sm font-medium text-gray-700"
    //         >
    //           Role
    //         </label>
    //         <select
    //           id="role"
    //           name="role"
    //           value={formData.role}
    //           onChange={handleChange}
    //           required
    //           className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    //         >
    //           <option value="USER">User</option>
    //           <option value="QUIZ_CREATOR">Quiz Creator</option>
    //         </select>
    //       </div>
    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
    //           loading ? "opacity-50 cursor-not-allowed" : ""
    //         }`}
    //       >
    //         {loading ? "Signing Up..." : "Sign Up"}
    //       </button>
    //     </form>
    //     <p className="mt-4 text-center text-sm text-gray-600">
    //       Already have an account?{" "}
    //       <a href="/login" className="text-blue-600 hover:underline">
    //         Login
    //       </a>
    //     </p>
    //   </div>
    //   <ToastContainer position="bottom-right" />
    // </div>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="QUIZ_TAKER">User</option>
              <option value="QUIZ_CREATOR">Quiz Creator</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Signup;
