import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const destinations = [
  { emoji: "🏔️", name: "Kilimanjaro" },
  { emoji: "🦁", name: "Maasai Mara" },
  { emoji: "🏖️", name: "Diani Beach" },
  { emoji: "🌺", name: "Zanzibar" },
  { emoji: "🐘", name: "Amboseli" },
  { emoji: "🌊", name: "Watamu" },
];

export default function Login() {
  const [isLogin, setIsLogin]       = useState(true);
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const loggedInUser = await login(email, password);

        if (loggedInUser.mustChangePassword) {
          navigate("/changepassword", { state: { email: loggedInUser.email } });
          return;
        }

        if (loggedInUser.role === "admin")      navigate("/admin");
        else if (loggedInUser.role === "staff") navigate("/staff");
        else                                    navigate("/customer");
      } else {
        alert("Signup not implemented yet.");
      }
    } catch (err) {
      alert("Authentication failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden fixed top-0 left-0 font-[Poppins]">

      {/* ════════════════════════════════
          LEFT — Travel Visual Panel
      ════════════════════════════════ */}
      <div
        className="hidden mt-12 md:flex w-1/2 h-full flex-col justify-between p-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #78350f 0%, #92400e 30%, #b45309 60%, #d97706 85%, #fbbf24 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-black/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-yellow-300/10 rounded-full blur-2xl" />

        {/* Logo */}
        {/* <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
            ✈️
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">Pocket of Paradise</p>
            <p className="text-yellow-200 text-xs tracking-widest uppercase opacity-80">Travel Agency</p>
          </div>
        </div> */}

        {/* Hero text */}
        <div className="z-10">
          <p className="text-yellow-200 text-xs tracking-widest uppercase mb-4 opacity-80">
            ✦ East Africa's Finest
          </p>
          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Your Next<br />
            <span className="text-yellow-300">Adventure</span><br />
            Awaits You
          </h2>
          <p className="text-yellow-100 text-sm leading-relaxed opacity-85 max-w-xs">
            From the great savannahs of the Mara to the pristine shores 
            of the Indian Ocean — we take you there.
          </p>

          {/* Destination pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {destinations.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm 
                border border-white/20 rounded-full px-3 py-1.5"
              >
                <span className="text-sm">{d.emoji}</span>
                <span className="text-white text-xs font-medium">{d.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="z-10 flex gap-6 border-t border-white/20 pt-6">
          {[
            { value: "50+", label: "Destinations" },
            { value: "2K+", label: "Happy Travelers" },
            { value: "10+", label: "Years Experience" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-white font-bold text-xl">{s.value}</p>
              <p className="text-yellow-200 text-xs opacity-75">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          RIGHT — Auth Form Panel
      ════════════════════════════════ */}
      <div className="w-full md:w-1/2 mt-12 h-full bg-white flex items-center justify-center p-6 relative overflow-y-auto">

        {/* Subtle background glows */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-yellow-50 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-50 rounded-full blur-2xl opacity-50" />

        <div className="w-full max-w-md z-10">

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-8 justify-center">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-yellow-700 text-lg">Pocket of Paradise</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Heading */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 
                bg-yellow-100 rounded-2xl mb-4 text-xl">
                  {isLogin ? "👋" : "🌍"}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {isLogin ? "Welcome back" : "Join us today"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isLogin
                    ? "Sign in to manage your bookings & trips"
                    : "Create your account and start exploring"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={submit} className="space-y-4">

                {/* Name — signup only */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Mwangi"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800
                      placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent 
                      focus:outline-none transition text-sm"
                    />
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800
                    placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent 
                    focus:outline-none transition text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Password
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        className="text-xs text-yellow-600 hover:underline font-medium"
                        onClick={() => alert("Forgot password — coming soon")}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-800
                      placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent 
                      focus:outline-none transition text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                      hover:text-gray-600 text-lg transition"
                    >
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 
                  hover:from-yellow-700 hover:to-amber-600 text-white font-semibold 
                  py-3.5 rounded-xl shadow-md transition-all duration-300 
                  hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 
                  disabled:cursor-not-allowed disabled:translate-y-0 mt-2 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </span>
                  ) : (
                    <span>{isLogin ? "Sign In  ✈️" : "Create Account  🌍"}</span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-300">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Switch mode */}
              {/* <p className="text-center text-sm text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-yellow-600 font-semibold hover:underline"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p> */}

              {/* Trust badges */}
              <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-50">
                {["🔒 Secure Login", "🌍 50+ Destinations", "🎒 Easy Booking"].map((badge) => (
                  <span key={badge} className="text-xs text-gray-300 font-medium">{badge}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}