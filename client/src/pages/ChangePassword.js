import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email]           = useState(location.state?.email || "");
  const [tempPassword,    setTempPassword]    = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Minimum 6 characters required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tempPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to change password");
        return;
      }

      setDone(true);
      toast.success("Password updated! Redirecting...");
      setTimeout(() => navigate("/login"), 2500);

    } catch (err) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;

  return (
    <div className="h-screen w-screen flex overflow-hidden fixed top-0 left-0 font-[Poppins]">

      {/* ════════════════════════════════
          LEFT — Travel Visual Panel
      ════════════════════════════════ */}
      <div
        className="hidden md:flex w-1/2 h-full flex-col justify-between p-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #92400e 0%, #b45309 40%, #d97706 75%, #fbbf24 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

        {/* Logo */}
        <div className="z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✈️</span>
            <div>
              <p className="text-white font-bold text-xl leading-none">Pocket of Paradise</p>
              <p className="text-yellow-200 text-xs tracking-widest uppercase">Travel Agency</p>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="z-10 text-white">
          <div className="text-6xl mb-6">🌍</div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            One step closer<br />to your next<br />adventure
          </h2>
          <p className="text-yellow-100 text-sm leading-relaxed opacity-90">
            Set a secure password to protect your travel bookings, 
            itineraries, and account preferences.
          </p>

          {/* Travel stats */}
          <div className="flex gap-6 mt-8">
            {[
              { icon: "🏝️", label: "50+ Destinations" },
              { icon: "🛡️", label: "Secure & Private" },
              { icon: "🎒", label: "Easy Bookings" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-yellow-100 text-xs font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="z-10">
          <p className="text-yellow-200 text-xs opacity-70 italic">
            "The world is a book, and those who do not travel read only one page."
          </p>
        </div>
      </div>

      {/* ════════════════════════════════
          RIGHT — Form Panel
      ════════════════════════════════ */}
      <div className="w-full md:w-1/2 h-full mt-12 bg-white flex items-center justify-center p-6 relative overflow-y-auto">

        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl opacity-40" />

        <div className="w-full max-w-md z-10">

          {done ? (
            /* ── Success State ── */
            <div className="text-center py-10">
              <div className="text-7xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-2xl font-bold text-yellow-700 mb-2">Password Updated!</h2>
              <p className="text-gray-500 text-sm">Redirecting you to login...</p>
              <div className="mt-6 w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-yellow-500 h-1.5 rounded-full transition-all duration-[2500ms]"
                  style={{ width: done ? "100%" : "0%" }}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-2xl mb-4">
                  <span className="text-2xl">🔐</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Set New Password</h1>
                <p className="text-gray-500 text-sm">
                  First time here? Replace your temporary password<br />
                  to secure your account.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email — locked */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 w-full border border-gray-200 bg-gray-50 
                  rounded-xl px-4 py-3">
                    <span className="text-gray-400 text-sm">📧</span>
                    <span className="text-gray-400 text-sm flex-1">{email}</span>
                    <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">locked</span>
                  </div>
                </div>

                {/* Temp Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="From your welcome email"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800
                    placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent 
                    focus:outline-none transition text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    🔑 Check your inbox for the email we sent when your account was created
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">New credentials</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800
                    placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent 
                    focus:outline-none transition text-sm"
                  />
                  {/* Strength bar */}
                  {newPassword && (
                    <div className="mt-1.5 flex gap-1">
                      {[1,2,3,4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            newPassword.length >= i * 3
                              ? i <= 1 ? "bg-red-400"
                              : i <= 2 ? "bg-orange-400"
                              : i <= 3 ? "bg-yellow-400"
                              : "bg-green-400"
                              : "bg-gray-100"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className={`w-full border rounded-xl px-4 py-3 text-gray-800
                    placeholder-gray-300 focus:ring-2 focus:outline-none transition text-sm
                    ${confirmPassword
                      ? passwordsMatch
                        ? "border-green-300 focus:ring-green-300"
                        : "border-red-300 focus:ring-red-300"
                      : "border-gray-200 focus:ring-yellow-400 focus:border-transparent"
                    }`}
                  />
                  {confirmPassword && (
                    <p className={`text-xs mt-1 font-medium ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                      {passwordsMatch ? "✅ Passwords match" : "❌ Passwords do not match"}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !passwordsMatch}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 
                  hover:to-amber-600 text-white font-semibold py-3.5 rounded-xl shadow-md 
                  transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Change Password & Continue ✈️"
                  )}
                </button>

                {/* Back to login */}
                <p className="text-center text-sm text-gray-400 pt-1">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-yellow-600 font-semibold hover:underline"
                  >
                    Back to Login
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}