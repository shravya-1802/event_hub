import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();

  // ✅ Get user role from localStorage
  let userRole = null;
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    userRole = user?.role || null;
  } catch (err) {
    console.error("❌ Failed to parse user", err);
  }

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/Signin");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-white">
      {/* Logo */}
      <h1 className="font-semibold text-2xl text-[#4f46e5]">EVENT HUB</h1>

      {/* Auth Buttons */}
      <div className="flex gap-4">
        {userRole ? (
          // ✅ Show Logout if logged in
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
          >
            Logout
          </button>
        ) : (
          // ✅ Show SignIn + SignUp if not logged in
          <>
            <Link
              to="/Signup"
              className="bg-[#4f46e5] text-white px-4 py-2 rounded-md hover:bg-[#4338ca] transition"
            >
              Sign Up
            </Link>
            <Link
              to="/Signin"
              className="border border-[#4f46e5] text-[#4f46e5] px-4 py-2 rounded-md hover:bg-[#eef2ff] transition"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
