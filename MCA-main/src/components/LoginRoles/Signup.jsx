import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import api from "../../Modules/Api";

const SignupForm = () => {
  const [role, setRole] = useState("User"); // default role is User
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(api+"api/signup", {
        role,
        username,
        password,
      });

      console.log("✅ Success:", response.data);
      alert("Signup successful!");
      navigate("/Signin");
    } catch (error) {
      console.error("❌ Error submitting form:", error.response?.data || error.message);
      alert("Signup failed!");
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
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-100 mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Sign Up</h1>
        <p className="text-gray-500">Create your account as {role}</p>
      </div>

      {/* Signup Box */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="User">User</option>
              <option value="Organizer">Organizer</option>
            </select>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
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
            Sign Up as {role}
          </button>
        </form>

        {/* Already have an account */}
        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <a href="/Signin" className="text-indigo-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
