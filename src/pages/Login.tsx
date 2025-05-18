"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";
import {
  Mail,
  Lock,
  BookOpen,
  HelpCircle,
  Pencil,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().optional(),
});

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);

    try {
      await dispatch(login(values)).unwrap();

      toast.success("Login successful! Welcome back to QuizWiz.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  }

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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100">
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
              Log in to QuizWiz
            </CardTitle>
            <CardDescription className="text-gray-600">
              Access your account to create and take quizzes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800 py-0"
                            {...field}
                          />
                          <Mail className="absolute left-3 top-[calc(50%+3px)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-gray-700">
                          Password
                        </FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800 py-0"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-[calc(50%+3px)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-gray-300 text-blue-500"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-gray-700">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg h-12 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
                    ) : null}
                    {isLoading ? "Logging in..." : "Log in"}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center w-full">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default Login;
