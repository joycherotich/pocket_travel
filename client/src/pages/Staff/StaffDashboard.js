import React, { useState } from "react";
import {
  FaPlaneDeparture,
  FaUsers,
  FaClipboardList,
  FaChartLine,
  FaHotel,
  FaBars,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function StaffDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine />,      path: "/staff"          },
    { name: "Bookings",  icon: <FaClipboardList />,  path: "/staff/bookings" },
    { name: "Clients",   icon: <FaUsers />,           path: "/staff/clients"  },
    { name: "Hotel",     icon: <FaHotel />,           path: "/staff/hotel"    },
    { name: "Reports",   icon: <FaPlaneDeparture />,  path: "/staff/reports"  },
  ];

  const isActive = (path) => {
    if (path === "/staff") return location.pathname === "/staff";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex font-[Poppins] bg-gray-50 min-h-screen">

      {/* ── Sidebar ── */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={
          "fixed left-0 top-0 h-screen bg-teal-700 text-white flex flex-col " +
          "transition-all duration-300 shadow-xl z-40 " +
          (sidebarOpen ? "w-64" : "w-20")
        }
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-teal-600">
          {sidebarOpen && (
            <div>
              <p className="font-bold text-base leading-none">Pocket of Paradise</p>
              <p className="text-teal-300 text-xs mt-0.5">Staff Portal</p>
            </div>
          )}
          <FaBars
            className="cursor-pointer text-teal-200 hover:text-white transition flex-shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              className={
                "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer " +
                "transition-all duration-200 " +
                (isActive(item.path)
                  ? "bg-yellow-400 text-teal-900 font-semibold shadow"
                  : "hover:bg-teal-600 text-teal-100")
              }
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.name}</span>}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="px-4 py-4 border-t border-teal-600">
            <p className="text-teal-300 text-xs">🌴 Staff Portal v1.0</p>
          </div>
        )}
      </motion.aside>

      {/* ── Main Content ── */}
      <div
        className={
          "flex-1 transition-all duration-300 p-6 md:p-10 " +
          (sidebarOpen ? "ml-64" : "ml-20")
        }
      >
        <Outlet />
      </div>
    </div>
  );
}