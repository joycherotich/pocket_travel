import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsersCog,
  FaUsers,
  FaMoneyBillWave,
  FaFileAlt,
  FaUserCircle,
  FaBars,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // On mount, read user from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from sessionStorage", err);
      }
    }
  }, []);

  // Check if user has a privilege, admin has all access
  const hasPrivilege = (privilege) => {
    if (!user || !user.role) return false;
  
    if (user.role === "admin") return true;
  
    // If you later add privileges array inside role object, adjust here:
    if (!user.role.privileges) return false;
  
    return user.role.privileges.includes(privilege);
  };
  

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboardadmin", privilege: "viewDashboard" },
    { name: "Manage Packages", icon: <FaUsersCog />, path: "/admin/managepackages", privilege: "managePackages" },
    { name: "Clients", icon: <FaUsers />, path: "/admin/client", privilege: "manageClients" },
    { name: "Reports", icon: <FaFileAlt />, path: "/admin/report", privilege: "viewReports" },
    { name: "Payments", icon: <FaMoneyBillWave />, path: "/admin/payments", privilege: "managePayments" },
    { name: "Portal Users", icon: <FaUsersCog />, path: "/admin/users", privilege: "manageUsers" },
    { name: "Roles & Priviledges", icon: <FaUsersCog />, path: "/admin/roles", privilege: "manageUsers" },
    { name: "Commission Report", icon: <FaFileInvoiceDollar />, path: "/admin/commissionreport", privilege: "viewReports" },
    { name: "Profile", icon: <FaUserCircle />, path: "/admin/profilecompany", privilege: null }, // no restriction
  ];

  return (
    <div className="flex font-[Poppins] bg-gray-50 min-h-screen relative">
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

        <nav className="flex-1 space-y-3">
          {menuItems
            .filter((item) => !item.privilege || hasPrivilege(item.privilege))
            .map((item) => (
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
