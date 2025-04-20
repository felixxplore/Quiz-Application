import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Get token from URL
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
  
    useEffect(() => {
      if (!token) {
        setMessage("Invalid or missing token.");
      }
    }, [token]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
  
      if (response.ok) {
        setMessage("Password reset successful!");
      } else {
        setMessage("Error resetting password. Please try again.");
      }
    };
  
    return (
      <div>
        <h2>Reset Password</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    );
};

export default ResetPassword;

  