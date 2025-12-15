import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const loggedInUser = await login(email, password);

        sessionStorage.setItem("userEmail", loggedInUser.email);
        sessionStorage.setItem("userName", loggedInUser.name);
        sessionStorage.setItem("userRole", loggedInUser.role);

        if (loggedInUser.role === "admin") navigate("/admin");
        else if (loggedInUser.role === "staff") navigate("/staff");
        else navigate("/customer");
      } else {
        alert("Signup not implemented yet.");
      }
    } catch (err) {
      alert("Authentication failed: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-gray-100 font-[Poppins] overflow-hidden fixed top-0 left-0">

      {/* ================= LEFT SIDE ================= */}
      <div className="w-full md:w-1/2 h-1/3 md:h-full flex items-center justify-center p-6 bg-gradient-to-br from-yellow-600 to-yellow-400 relative">
        <div className="text-center text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ✈️ Travel Agency
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Your next adventure starts here.
          </p>
        </div>

        {/* background circles */}
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white relative overflow-hidden p-6">

        <div className="w-full max-w-md p-6 md:p-10 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-bold text-yellow-700 text-center mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>

              <p className="text-center text-gray-500 mb-8">
                {isLogin
                  ? "Sign in to continue your adventure"
                  : "Start your journey with us today"}
              </p>

              {/* ================= FORM ================= */}
              <form onSubmit={submit} className="space-y-5">

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 
                    focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                    required
                  />
                </div>

                {/* Signup Only */}
                {!isLogin && (
                  <>
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Mwangi"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 
                        focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                        required
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Select Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700
                        focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 
                    focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                    required
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold 
                  py-2.5 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg 
                  hover:-translate-y-[2px]"
                >
                  {isLogin ? "Sign In" : "Sign Up"}
                </button>
              </form>

              {/* SWITCH */}
              <p className="text-center text-gray-600 mt-6">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-yellow-600 font-semibold hover:underline"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* background glow */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-100 rounded-full blur-3xl opacity-30"></div>
      </div>
    </div>
  );
}
