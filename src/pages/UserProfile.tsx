 
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Mail, User, Shield, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define the User type based on the data structure
interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  createdAt: string;
  enabled: boolean;
}

const UserProfile: React.FC = () => {
  // Access user data from Redux
  const { user } = useSelector((state: RootState) => state.auth);

  // If no user data is available, show a fallback card
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-6 max-w-md mx-auto flex justify-center"
      >
        <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full">
          <CardContent className="p-6 flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-gray-500" />
            <p className="text-lg font-medium text-gray-600">
              No user profile data available.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Format the createdAt date with AM/PM
  const formattedCreatedAt = new Date(user.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Capitalize role (e.g., "user_admin" → "User Admin")
  const formattedRole = user.role
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="p-6 max-w-md mx-auto flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-blue-100 rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              <User className="h-6 w-6 text-blue-500" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <AnimatePresence>
              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
              >
                <Label className="flex items-center gap-2 text-gray-700 font-semibold min-w-[100px]">
                  <User className="h-5 w-5 text-blue-500" />
                  Name
                </Label>
                <p className="text-gray-900">{user.name}</p>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
              >
                <Label className="flex items-center gap-2 text-gray-700 font-semibold min-w-[100px]">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Email
                </Label>
                <p className="text-gray-900">{user.email}</p>
              </motion.div>

              {/* Role */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
              >
                <Label className="flex items-center gap-2 text-gray-700 font-semibold min-w-[100px]">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Role
                </Label>
                <p className="text-gray-900">{formattedRole}</p>
              </motion.div>

              {/* Created At */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
              >
                <Label className="flex items-center gap-2 text-gray-700 font-semibold min-w-[100px]">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Joined On
                </Label>
                <p className="text-gray-900">{formattedCreatedAt}</p>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfile;
