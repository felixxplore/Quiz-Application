// src/components/Navbar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type{ AppDispatch, RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import { Home, BookOpen, User, LogOut, UserPlus, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RouteItem {
  to: string;
  label: string;
  icon: React.ReactElement;
  active: boolean;
  onClick?: () => void;
  roles?: Array<"USER" | "ADMIN" | "QUIZ_CREATOR">; // Restrict route visibility by role
}

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token && !!user;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: Clear state and navigate
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const routes: RouteItem[] = [
    {
      to: "/",
      label: "Home",
      icon: <Home className="mr-2 h-4 w-4" />,
      active: pathname === "/",
    },
    {
      to: "/topics",
      label: "Topics",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      active: pathname === "/topics",
    },
    {
      to: "/quizzes",
      label: "Quizzes",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      active: pathname === "/quizzes",
    },
    {
      to: "/history",
      label: "History",
      icon: <User className="mr-2 h-4 w-4" />,
      active: pathname === "/history",
      roles: ["USER", "ADMIN", "QUIZ_CREATOR"], // Only for logged-in users
    },
    {
      to: "/admin",
      label: "Admin",
      icon: <User className="mr-2 h-4 w-4" />,
      active: pathname === "/admin",
      roles: ["ADMIN"], // Only for admins
    },
    {
      to: "/profile",
      label: "Profile",
      icon: <User className="mr-2 h-4 w-4" />,
      active: pathname === "/profile",
      roles: ["USER", "ADMIN", "QUIZ_CREATOR"], // Only for logged-in users
    },
    ...(isLoggedIn
      ? [
          {
            to: "#",
            label: "Logout",
            icon: <LogOut className="mr-2 h-4 w-4" />,
            active: false,
            onClick: handleLogout,
            roles: ["USER", "ADMIN", "QUIZ_CREATOR"] as Array<"USER" | "ADMIN" | "QUIZ_CREATOR">,
          },
        ]
      : [
          {
            to: "/signup",
            label: "Signup",
            icon: <UserPlus className="mr-2 h-4 w-4" />,
            active: pathname === "/signup",
          },
          {
            to: "/login",
            label: "Login",
            icon: <LogIn className="mr-2 h-4 w-4" />,
            active: pathname === "/login",
          },
        ]),
  ];

  // Filter routes based on user role
  const filteredRoutes = routes.filter((route) => {
    if (!route.roles) return true; // Public route
    return (
      isLoggedIn &&
      route.roles.includes(user?.role as "USER" | "ADMIN" | "QUIZ_CREATOR")
    );
  });

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-pink-500" />
          <span className="font-bold text-xl text-gray-800">QuizWiz</span>
        </Link>
        <nav className="flex items-center space-x-6">
          {filteredRoutes.map((route) =>
            route.onClick ? (
              <Button
                key={route.label}
                variant="ghost"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground"
                )}
                onClick={route.onClick}
              >
                {route.icon}
                {route.label}
              </Button>
            ) : (
              <Link
                key={route.to}
                to={route.to}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
