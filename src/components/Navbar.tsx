import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, BookOpen, User, Home, Award, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // For demo purposes

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  const routes = [
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
      icon: <Award className="mr-2 h-4 w-4" />,
      active: pathname === "/quizzes",
    },
    {
      to: "/profile",
      label: "Profile",
      icon: <User className="mr-2 h-4 w-4" />,
      active: pathname === "/profile",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-magenta-DEFAULT" />
            <span className="font-bold text-xl">QuizWiz</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {routes.map((route) => (
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
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />

          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 py-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <BookOpen className="h-6 w-6 text-magenta-DEFAULT" />
                  <span className="font-bold text-xl">QuizWiz</span>
                </Link>
                <div className="flex flex-col space-y-3">
                  {routes.map((route) => (
                    <Link
                      key={route.to}
                      to={route.to}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {route.icon}
                      {route.label}
                    </Link>
                  ))}
                  {isLoggedIn ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="justify-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  ) : (
                    <div className="flex flex-col space-y-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button
                        size="sm"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
