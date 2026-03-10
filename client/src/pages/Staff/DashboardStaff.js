import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaClipboardList, FaHotel, FaCheckCircle } from "react-icons/fa";

export default function DashboardStaff() {
  const metrics = [
    { title: "My Clients",       value: 32,   icon: <FaUsers />,         color: "bg-yellow-100 text-yellow-700" },
    { title: "Active Bookings",  value: 18,   icon: <FaClipboardList />, color: "bg-blue-100 text-blue-700"    },
    { title: "Hotels Managed",   value: 7,    icon: <FaHotel />,         color: "bg-teal-100 text-teal-700"    },
    { title: "Completed Trips",  value: 54,   icon: <FaCheckCircle />,   color: "bg-green-100 text-green-700"  },
  ];

  const myBookings = [
    { id: 1, client: "Alice Mwende",   destination: "Maasai Mara",  date: "Nov 10, 2025", status: "Confirmed" },
    { id: 2, client: "Brian Otieno",   destination: "Zanzibar",     date: "Nov 15, 2025", status: "Pending"   },
    { id: 3, client: "Carol Wanjiru",  destination: "Diani Beach",  date: "Nov 20, 2025", status: "Confirmed" },
    { id: 4, client: "David Kamau",    destination: "Kilimanjaro",  date: "Dec 01, 2025", status: "Cancelled" },
  ];

  return (
    <div className="space-y-8 font-[Poppins]">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Staff Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Your activity overview</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className={"rounded-2xl p-5 flex items-center gap-4 shadow-md " + m.color}
          >
            <div className="text-3xl">{m.icon}</div>
            <div>
              <p className="text-sm font-semibold">{m.title}</p>
              <h3 className="text-2xl font-bold">{m.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* My Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">My Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-yellow-50 text-gray-600 text-left">
                <th className="p-3 rounded-tl-lg">#</th>
                <th className="p-3">Client</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Date</th>
                <th className="p-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {myBookings.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3 font-medium">{b.client}</td>
                  <td className="p-3">{b.destination}</td>
                  <td className="p-3 text-gray-500">{b.date}</td>
                  <td className="p-3">
                    <span className={
                      "px-2.5 py-1 rounded-full text-xs font-semibold " +
                      (b.status === "Confirmed" ? "bg-green-100 text-green-700" :
                       b.status === "Pending"   ? "bg-yellow-100 text-yellow-700" :
                                                  "bg-red-100 text-red-600")
                    }>
                      {b.status}
                    </span>
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