import React from "react";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaUsers,
  FaPlaneDeparture,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

export default function DashboardHome() {
  const metrics = [
    { title: "Total Bookings", value: 48, icon: <FaClipboardList />, color: "bg-yellow-100 text-yellow-700" },
    { title: "Active Clients", value: 126, icon: <FaUsers />, color: "bg-teal-100 text-teal-700" },
    { title: "Available Trips", value: 6, icon: <FaPlaneDeparture />, color: "bg-blue-100 text-blue-700" },
    { title: "Revenue Growth", value: "+23%", icon: <FaChartLine />, color: "bg-green-100 text-green-700" },
  ];

  const bookings = [
    { id: 1, destination: "Zanzibar", clients: 12, status: "Confirmed", date: "2025-11-10" },
    { id: 2, destination: "Cape Town", clients: 20, status: "Pending", date: "2025-12-05" },
    { id: 3, destination: "Mauritius", clients: 25, status: "Full", date: "2025-11-22" },
    { id: 4, destination: "Nairobi", clients: 8, status: "Confirmed", date: "2025-12-15" },
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-3xl mt-4 font-bold text-teal-700 mb-6">Dashboard</h2>

      {/* === Metrics Cards === */}
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

      {/* === Overview Section === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Summary</h3>
        <p className="text-gray-600 mb-4">
          Here’s a quick snapshot of current trips, clients, and their booking statuses.
        </p>

        {/* === Data Table === */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-teal-100 text-teal-700">
                <th className="p-3">Destination</th>
                <th className="p-3">Clients</th>
                <th className="p-3">Status</th>
                <th className="p-3">Departure Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b hover:bg-yellow-50 transition">
                  <td className="p-3 font-medium text-gray-800">{b.destination}</td>
                  <td className="p-3">{b.clients}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        b.status === "Confirmed"
                          ? "text-green-600"
                          : b.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {b.status === "Confirmed" && <FaCheckCircle />}
                      {b.status === "Pending" && <FaClock />}
                      {b.status === "Full" && <FaTimesCircle />}
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">{b.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* === Additional Insights === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-yellow-100 to-teal-100 rounded-2xl shadow-inner p-6"
      >
        <h3 className="text-lg font-semibold text-teal-800 mb-2">Performance Insights</h3>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>Most popular destination: <span className="font-semibold text-teal-900">Mauritius</span></li>
          <li>Highest booking month: <span className="font-semibold text-teal-900">November 2025</span></li>
          <li>Customer satisfaction rate: <span className="font-semibold text-teal-900">92%</span></li>
          <li>Pending payments: <span className="font-semibold text-yellow-700">4</span> bookings awaiting confirmation</li>
        </ul>
      </motion.div>
    </div>
  );
}
