import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUsersCog,
  FaUsers,
  FaMoneyBillWave,
  FaFileAlt,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboardadmin" },
    { name: "Manage Packages", icon: <FaUsersCog />, path: "/admin/managepackages" },
    { name: "Clients", icon: <FaUsers />, path: "/admin/client" },
    { name: "Reports", icon: <FaFileAlt />, path: "/admin/report" },
    { name: "Payments", icon: <FaMoneyBillWave />, path: "/admin/payments" },
    { name: "Users & Roles", icon: <FaUsersCog />, path: "/admin/users" },
    { name: "Profile", icon: <FaUserCircle />, path: "/admin/profilecompany" },

  ];

  return (
    <div className="flex font-[Poppins] bg-gray-50 min-h-screen relative">
      {/* ===== Sidebar ===== */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } fixed left-0 top-0 h-screen bg-gray-800 text-white p-4 flex flex-col transition-all duration-300 shadow-xl`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-lg font-bold ${!sidebarOpen && "hidden"}`}>
            🌴 Admin Portal
          </h1>
          <FaBars
            className="cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* ===== Menu ===== */}
        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                location.pathname === item.path
                  ? "bg-yellow-400 text-gray-900 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </div>
          ))}
        </nav>

        <div className="text-sm text-gray-400 mt-10">
          {sidebarOpen && "Admin Access"}
        </div>
      </motion.aside>

      {/* ===== Main Content ===== */}
      <div
        className={`flex-1 p-6 md:p-10 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
