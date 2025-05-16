import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Mail, User, Shield } from "lucide-react";

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

  // If no user data is available, show a fallback message
  if (!user) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No user profile data available.</p>
      </div>
    );
  }

  // Format the createdAt date
  const formattedCreatedAt = new Date(user.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-blue-500" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-3">
            <Label className="flex items-center gap-2 text-gray-700 font-semibold">
              <User className="h-5 w-5 text-gray-500" />
              Name
            </Label>
            <p className="text-gray-900">{user.name}</p>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Label className="flex items-center gap-2 text-gray-700 font-semibold">
              <Mail className="h-5 w-5 text-gray-500" />
              Email
            </Label>
            <p className="text-gray-900">{user.email}</p>
          </div>

          {/* Role */}
          <div className="flex items-center gap-3">
            <Label className="flex items-center gap-2 text-gray-700 font-semibold">
              <Shield className="h-5 w-5 text-gray-500" />
              Role
            </Label>
            <p className="text-gray-900">
              {user?.role.toLowerCase().replace("_", " ")}
            </p>
          </div>

          {/* Created At */}
          <div className="flex items-center gap-3">
            <Label className="flex items-center gap-2 text-gray-700 font-semibold">
              <Calendar className="h-5 w-5 text-gray-500" />
              Joined On
            </Label>
            <p className="text-gray-900">{formattedCreatedAt}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
