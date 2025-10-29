import React from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaUserTie,
  FaMoneyBillWave,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";

export default function DashboardAdmin() {
  const metrics = [
    {
      title: "Total Clients",
      value: 248,
      icon: <FaUsers />,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Active Staff",
      value: 15,
      icon: <FaUserTie />,
      color: "bg-teal-100 text-teal-700",
    },
    {
      title: "Total Revenue",
      value: "$42,780",
      icon: <FaMoneyBillWave />,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Bookings Made",
      value: 187,
      icon: <FaClipboardList />,
      color: "bg-blue-100 text-blue-700",
    },
  ];

  const recentPayments = [
    { id: 1, client: "John Doe", amount: "$1,200", date: "Oct 25, 2025", status: "Completed" },
    { id: 2, client: "Mary Wanjiru", amount: "$840", date: "Oct 27, 2025", status: "Pending" },
    { id: 3, client: "James Otieno", amount: "$560", date: "Oct 28, 2025", status: "Completed" },
    { id: 4, client: "Lucy Kim", amount: "$1,050", date: "Oct 29, 2025", status: "Failed" },
  ];

  return (
    <div className="space-y-10 font-[Poppins]">
      <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6">
        Admin Dashboard
      </h2>

      {/* === Stats Cards === */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className={`rounded-2xl p-5 flex items-center gap-4 shadow-md ${m.color}`}
          >
            <div className="text-3xl">{m.icon}</div>
            <div>
              <p className="text-sm font-semibold">{m.title}</p>
              <h3 className="text-2xl font-bold">{m.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* === Revenue Chart Placeholder === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Revenue Overview
        </h3>
        <p className="text-gray-600 mb-3">
          Analytics of total bookings and revenue growth trends across all destinations.
        </p>

        <div className="h-56 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400">
          📊 Chart Coming Soon
        </div>
      </motion.div>

      {/* === Recent Payments Table === */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Payments
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-left">
                <th className="p-3">#</th>
                <th className="p-3">Client</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{p.id}</td>
                  <td className="p-3 font-medium">{p.client}</td>
                  <td className="p-3">{p.amount}</td>
                  <td className="p-3">{p.date}</td>
                  <td
                    className={`p-3 font-semibold ${
                      p.status === "Completed"
                        ? "text-green-600"
                        : p.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
