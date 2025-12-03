import React, { useState } from "react";
import {
  FaPlaneDeparture,
  FaUsers,
  FaClipboardList,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBars,
  FaHotel
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function StaffDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split("/")[2] || "dashboard";

  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine />, path: "/staff" },
    { name: "Bookings", icon: <FaClipboardList />, path: "/staff/bookings" },
    { name: "Clients", icon: <FaUsers />, path: "/staff/clients" },
    { name: "Hotel", icon: <FaHotel />, path: "/staff/hotel" },
    { name: "Reports", icon: <FaPlaneDeparture />, path: "/staff/reports" },

  ];

  // … keep your metrics, bookings, etc. arrays here …

  return (
    <div className="flex font-[Poppins] bg-gray-50 min-h-screen relative">
      {/* ===== Sidebar ===== */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } fixed left-0 top-0 h-screen bg-teal-700 text-white p-4 flex flex-col transition-all duration-300 shadow-xl`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-xl font-bold ${!sidebarOpen && "hidden"}`}>
            Pocket of Paradise
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
                  ? "bg-yellow-400 text-teal-900 font-semibold"
                  : "hover:bg-teal-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </div>
          ))}
        </nav>

        <div className="text-sm text-teal-100 mt-10">
          {sidebarOpen && "🌴 Staff Portal"}
        </div>
      </motion.aside>

      {/* ===== Main Content ===== */}
      <div
        className={`flex-1 p-6 md:p-10 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Render child pages here */}
        <Outlet />
      </div>
    </div>
  );
}
