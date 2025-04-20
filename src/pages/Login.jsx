import { loginUser, signUpuser } from "@/features/auth/authThunks";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrainCircuit, LightbulbIcon, Trophy } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { loading, error, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      toast.error(res.payload);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-100 to-blue-200">
      {/* Header */}
      <header className="bg-sky-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-8 w-8" />
            <h1 className="text-2xl font-bold">BrainQuiz</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white hover:text-sky-200">
              Join a Quiz
            </Button>
            <Button
              variant="outline"
              className="bg-sky-600 text-white border-sky-400 hover:bg-sky-800"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-sky-300 shadow-xl bg-white">
            <CardHeader className="space-y-1 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-t-lg">
              <div className="flex justify-center mb-2">
                <div className="bg-white p-3 rounded-full">
                  <BrainCircuit className="h-10 w-10 text-sky-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Welcome Back!
              </CardTitle>
              <CardDescription className="text-center text-sky-100">
                Login In to continue your learning journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sky-800 flex">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  onChange={handleChange}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sky-800">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-sky-600 hover:text-sky-800 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    placeholder="your password"
                    required
                    className="border-sky-200 focus:border-sky-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-sky-600 hover:text-sky-800"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.69.07-1.362.204-2.013M3.94 4.06a9.953 9.953 0 0112.02-.593M21 21L3 3"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 4.418-5.373 8-12 8S-1 16.418-1 12 4.373 4 12 4s12 3.582 12 8z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 bg-sky-50 rounded-b-lg p-6">
              <Button
                className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                onClick={handleSubmit}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="text-center text-sm text-sky-700">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-sky-600 hover:text-sky-800 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-2">
                <LightbulbIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-sm font-medium text-sky-800">Learn</h3>
              <p className="text-xs text-sky-600">Expand your knowledge</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-2">
                <BrainCircuit className="h-6 w-6 text-sky-500" />
              </div>
              <h3 className="text-sm font-medium text-sky-800">Challenge</h3>
              <p className="text-xs text-sky-600">Test your skills</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-2">
                <Trophy className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-sm font-medium text-sky-800">Achieve</h3>
              <p className="text-xs text-sky-600">Earn rewards</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-sky-800 text-sky-200 p-4 text-center text-sm">
        <p>© 2024 BrainQuiz. All rights reserved.</p>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default Login;
