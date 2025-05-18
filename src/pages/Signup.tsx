import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store/store";
import { signup, clearSignupSuccess } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  User,
  Lock,
  Users,
  BookOpen,
  HelpCircle,
  Pencil,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const SignupPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, signupSuccess } = useSelector(
    (state: RootState) => state.auth
  );
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "USER" as "USER" | "ADMIN" | "QUIZ_CREATOR",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(signup(formData)).unwrap();
    } catch (err) {
      // Error handled via Redux state
    }
  };

  React.useEffect(() => {
    if (signupSuccess) {
      dispatch(clearSignupSuccess());
      navigate("/login");
    }
  }, [signupSuccess, navigate, dispatch]);

  // Quiz-themed background icons
  const quizIcons = [
    { Icon: HelpCircle, size: 40, top: "10%", left: "15%", opacity: 0.2 },
    { Icon: BookOpen, size: 50, top: "20%", left: "80%", opacity: 0.3 },
    { Icon: Pencil, size: 30, top: "50%", left: "10%", opacity: 0.25 },
    { Icon: CheckCircle, size: 45, top: "70%", left: "70%", opacity: 0.2 },
    { Icon: HelpCircle, size: 35, top: "30%", left: "50%", opacity: 0.15 },
    { Icon: BookOpen, size: 60, top: "80%", left: "30%", opacity: 0.3 },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 bg-gradient-to-br from-blue-50 to-gray-100 overflow-hidden">
      {/* Background Quiz Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {quizIcons.map(({ Icon, size, top, left, opacity }, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ top, left }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity, scale: 1 }}
            transition={{
              delay: index * 0.2,
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2,
            }}
          >
            <Icon className="text-blue-200" size={size} />
          </motion.div>
        ))}
      </div>

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-screen max-w-md bg-white rounded-2xl shadow-xl border border-gray-100">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <BookOpen className="h-12 w-12 text-blue-500" />
                <HelpCircle className="h-6 w-6 text-white bg-blue-500 rounded-full absolute top-2 right-2" />
              </motion.div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Sign Up for QuizWiz
            </CardTitle>
            <CardDescription className="text-gray-600">
              Create your account to start quizzing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm text-left text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800 py-0"
                />
                <Mail className="absolute left-3 top-[calc(50%+10px)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <label
                  htmlFor="name"
                  className="block text-sm text-left text-gray-700 mb-1"
                >
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800 py-0"
                />
                <User className="absolute left-3 top-[calc(50%+10px)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm text-left text-gray-700 mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800 py-0"
                />
                <Lock className="absolute left-3 top-[calc(50%+10px)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <label
                  htmlFor="role"
                  className="block text-sm text-gray-700 text-left mb-1"
                >
                  Role
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      role: value as "USER" | "ADMIN" | "QUIZ_CREATOR",
                    })
                  }
                >
                  <SelectTrigger
                    id="role"
                    className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 h-12 text-gray-800 pl-10 py-0"
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-lg shadow-lg">
                    <SelectItem value="USER" className="hover:bg-blue-100">
                      User
                    </SelectItem>
                    <SelectItem
                      value="QUIZ_CREATOR"
                      className="hover:bg-blue-100"
                    >
                      Quiz Creator
                    </SelectItem>
                    <SelectItem value="ADMIN" className="hover:bg-blue-100">
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Users className="absolute left-3 top-[calc(50%+10px)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg h-12 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white mr-2"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Signing up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;
