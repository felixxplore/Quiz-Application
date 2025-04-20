import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:8080/api/auth/forgot-password",null, {params:{ email }});
        setMessage(response.data);
      } catch (error) {
        setMessage("Failed to send reset link",error.response?.data || error.message);
      }
    };
  
    return (
      <div className="flex flex-col items-center p-6">
        <h2 className="text-xl font-bold">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" required />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Send Reset Link</button>
        </form>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </div>
    );
  }