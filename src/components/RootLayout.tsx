import type React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
// import "@/index.css";

const RootLayout: React.FC = () => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">
              <Outlet />{" "}
              {/* This renders the page content (e.g., Home, Topics) */}
            </div>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
