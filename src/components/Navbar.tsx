import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import {
  Home,
  BookOpen,
  User,
  LogOut,
  UserPlus,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface RouteItem {
  to: string;
  label: string;
  icon: React.ReactElement;
  active: boolean;
  onClick?: () => void;
  roles?: Array<"USER" | "ADMIN" | "QUIZ_CREATOR">;
}

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token && !!user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const routes: RouteItem[] = [
    {
      to: "/",
      label: "Home",
      icon: <Home className="mr-2 h-5 w-5" />,
      active: pathname === "/",
    },
    {
      to: "/topics",
      label: "Topics",
      icon: <BookOpen className="mr-2 h-5 w-5" />,
      active: pathname === "/topics",
    },
    {
      to: "/quizzes",
      label: "Quizzes",
      icon: <BookOpen className="mr-2 h-5 w-5" />,
      active: pathname === "/quizzes",
    },
    {
      to: "/history",
      label: "History",
      icon: <User className="mr-2 h-5 w-5" />,
      active: pathname === "/history",
      roles: ["USER", "ADMIN", "QUIZ_CREATOR"] as Array<
        "USER" | "ADMIN" | "QUIZ_CREATOR"
      >,
    },
    {
      to: "/admin",
      label: "Admin",
      icon: <User className="mr-2 h-5 w-5" />,
      active: pathname === "/admin",
      roles: ["ADMIN" , "QUIZ_CREATOR"] as Array<"USER" | "ADMIN" | "QUIZ_CREATOR">,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: <User className="mr-2 h-5 w-5" />,
      active: pathname === "/profile",
      roles: ["USER", "ADMIN", "QUIZ_CREATOR"] as Array<
        "USER" | "ADMIN" | "QUIZ_CREATOR"
      >,
    },
    ...(isLoggedIn
      ? [
          {
            to: "#",
            label: "Logout",
            icon: <LogOut className="mr-2 h-5 w-5" />,
            active: false,
            onClick: handleLogout,
            roles: ["USER", "ADMIN", "QUIZ_CREATOR"] as Array<
              "USER" | "ADMIN" | "QUIZ_CREATOR"
            >,
          },
        ]
      : [
          {
            to: "/signup",
            label: "Signup",
            icon: <UserPlus className="mr-2 h-5 w-5" />,
            active: pathname === "/signup",
          },
          {
            to: "/login",
            label: "Login",
            icon: <LogIn className="mr-2 h-5 w-5" />,
            active: pathname === "/login",
          },
        ]),
  ];

  const filteredRoutes = routes.filter((route) => {
    if (!route.roles) return true;
    return (
      isLoggedIn &&
      route.roles.includes(user?.role as "USER" | "ADMIN" | "QUIZ_CREATOR")
    );
  });

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-gradient-to-r from-white to-blue-50 shadow-sm pl-2 pr-2">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <BookOpen className="h-8 w-8 text-pink-500" />
          </motion.div>
          <span className="font-bold text-2xl text-gray-800 hover:text-blue-600 transition-colors">
            QuizWiz
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center space-x-6">
          {filteredRoutes.map((route) => (
            <motion.div
              key={route.label}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {route.onClick ? (
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center text-base font-medium transition-colors",
                    route.active
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  )}
                  onClick={route.onClick}
                >
                  {route.icon}
                  {route.label}
                </Button>
              ) : (
                <Link
                  to={route.to}
                  className={cn(
                    "flex items-center text-base font-medium transition-colors",
                    route.active
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              )}
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          className="sm:hidden text-gray-600 hover:text-blue-600"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden bg-white border-b shadow-sm"
          >
            <div className="container flex flex-col items-center py-4 space-y-4">
              {filteredRoutes.map((route) => (
                <motion.div
                  key={route.label}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {route.onClick ? (
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full flex justify-center text-base font-medium transition-colors",
                        route.active
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                      )}
                      onClick={() => {
                        route.onClick!();
                        setIsMenuOpen(false);
                      }}
                    >
                      {route.icon}
                      {route.label}
                    </Button>
                  ) : (
                    <Link
                      to={route.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "w-full flex justify-center text-base font-medium transition-colors",
                        route.active
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                      )}
                    >
                      {route.icon}
                      {route.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
