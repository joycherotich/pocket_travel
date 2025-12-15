import React from "react";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaDownload,
  FaChartPie,
  FaMoneyBillWave,
  FaUserCheck,
} from "react-icons/fa";

export default function Reports() {
  const reportStats = [
    {
      title: "Monthly Bookings",
      value: "124",
      icon: <FaChartPie />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Revenue",
      value: "$58,430",
      icon: <FaMoneyBillWave />,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Active Clients",
      value: "218",
      icon: <FaUserCheck />,
      color: "bg-teal-100 text-teal-700",
    },
  ];

  const reports = [
    {
      name: "January 2025 Report",
      date: "2025-02-01",
      type: "Monthly Summary",
      status: "Completed",
    },
    {
      name: "February 2025 Report",
      date: "2025-03-01",
      type: "Monthly Summary",
      status: "Completed",
    },
    {
      name: "Q1 Performance",
      date: "2025-04-05",
      type: "Quarterly Report",
      status: "Completed",
    },
    {
      name: "April 2025 Report",
      date: "2025-05-01",
      type: "Monthly Summary",
      status: "In Progress",
    },
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-teal-700 mt-4">Reports</h2>

      {/* === Report Stats === */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportStats.map((r, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className={`rounded-2xl p-5 flex items-center gap-4 shadow-md ${r.color}`}
          >
            <div className="text-3xl">{r.icon}</div>
            <div>
              <p className="text-sm font-semibold">{r.title}</p>
              <h3 className="text-2xl font-bold">{r.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* === Reports Table === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Generated Reports
          </h3>
          <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow transition">
            <FaDownload /> Download All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 border-b">Report Name</th>
                <th className="px-4 py-3 border-b">Date Generated</th>
                <th className="px-4 py-3 border-b">Type</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b font-medium">
                    {r.name}
                  </td>
                  <td className="px-4 py-3 border-b">{r.date}</td>
                  <td className="px-4 py-3 border-b">{r.type}</td>
                  <td
                    className={`px-4 py-3 border-b font-semibold ${
                      r.status === "Completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {r.status}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <button className="flex items-center gap-1 text-teal-700 hover:text-teal-900 transition">
                      <FaFileAlt /> View
                    </button>
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
