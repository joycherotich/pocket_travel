import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaPlaneDeparture, FaClock, FaUser, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/travel.png";
import { useAuth } from "../../context/AuthContext";

export default function CustomerDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex font-[Poppins] bg-white">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between fixed top-0 left-0 h-full border-r border-gray-200">
        <div>
          {/* Logo Section */}
          <div className="flex items-center space-x-3 px-6 py-5 border-b border-gray-200">
            <img src={logo} alt="JetSet" className="h-10 w-auto" />
            <h2 className="text-xl font-bold text-yellow-700 tracking-tight">JetSet</h2>
          </div>

          {/* Menu Links */}
          <nav className="mt-4 space-y-1">
            <NavLink
              to="/customer/booking"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-2.5 text-sm font-medium rounded-r-full transition-all ${
                  isActive
                    ? "bg-yellow-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                }`
              }
            >
              <FaPlaneDeparture size={18} /> <span>Book a Trip</span>
            </NavLink>

            <NavLink
              to="/customer/progress"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-2.5 text-sm font-medium rounded-r-full transition-all ${
                  isActive
                    ? "bg-yellow-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                }`
              }
            >
              <FaClock size={18} /> <span>My Progress</span>
            </NavLink>

            <NavLink
              to="/customer/profile"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-2.5 text-sm font-medium rounded-r-full transition-all ${
                  isActive
                    ? "bg-yellow-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                }`
              }
            >
              <FaUser size={18} /> <span>Profile</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer - Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-start space-x-3 text-red-600 hover:bg-red-50 px-6 py-4 font-semibold text-sm transition"
        >
          <FaSignOutAlt size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="ml-64 flex-1 p-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 ">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome back, {user?.name || "Traveler"} 👋
          </h1>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
