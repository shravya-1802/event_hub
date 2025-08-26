import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Modules/Api";
import axios from "axios";

const SigninForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        api + "api/signin", // backend URL
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Login Success:", response.data);

      // Store full user object in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const UserRole = response.data.user.username;
      const Role = response.data.user.role;
      // Redirect based on role
      if (UserRole === "admin") {
        navigate("/Admin");
      } else {
        navigate("/" + Role);
      }


      alert("Login Successful!");
    } catch (error) {
      console.error("❌ Login Failed:", error.response?.data || error.message);
      alert("Login Failed!");
    }

  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f5f7ff] to-[#e6ebff]">
      {/* Back to Home */}
      <a href="/" className="text-sm text-indigo-600 mb-6 hover:underline">
        ← Back to Home
      </a>

      {/* Icon + Heading */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
          <span className="text-2xl">🔑</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
        <p className="text-gray-500">Welcome back! Please login</p>
      </div>

      {/* Signin Box */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
          >
            Sign In
          </button>
        </form>

        {/* Don’t have account */}
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
