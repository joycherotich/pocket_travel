import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    login(name || "Demo User", role);
    if (role === "admin") navigate("/admin");
    else if (role === "staff") navigate("/staff");
    else navigate("/customer");
  };

  return (
    <div className="h-screen w-screen flex flex-col mt-12 md:flex-row bg-gray-100 font-[Poppins] overflow-hidden fixed top-0 left-0">
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-white p-12 flex flex-col justify-center h-full">
          <h1 className="text-5xl font-extrabold mt-24 leading-tight mb-4 drop-shadow-lg">
            Discover Africa <br /> with Pocket Of Paradise
          </h1>
          <p className="text-lg text-gray-200 mb-6 max-w-md">
            From golden savannahs to crystal-blue beaches — we bring you
            unforgettable journeys with comfort and class.
          </p>
          <p className="text-sm text-yellow-400 mt-auto">
            © {new Date().getFullYear()} Pocket of Paradise Travel Company
          </p>
        </div>
      </div>

      {/* ===== Right Side - Auth Form ===== */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white relative overflow-hidden">
        <div className="w-full max-w-md p-8 md:p-10 z-10">
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

              <form onSubmit={submit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Mwangi"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                  />
                </div>

                {/* Email (Signup only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                    />
                  </div>
                )}

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Select Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                  >
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]"
                >
                  {isLogin ? "Sign In" : "Sign Up"}
                </button>
              </form>

              {/* Toggle */}
              <p className="text-center text-gray-600 mt-6">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
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

        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-100 rounded-full blur-3xl opacity-30"></div>
      </div>
    </div>
  );
}
