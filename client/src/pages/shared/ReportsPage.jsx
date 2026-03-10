import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaDownload } from "react-icons/fa";

export default function ReportsPage() {
  const { user } = useAuth();
  const isAdmin = user && user.role === "admin";

  const [activeTab, setActiveTab] = useState("bookings");

  const bookingReport = [
    { month: "July 2025",    bookings: 32, revenue: "$14,200", completed: 28, cancelled: 4  },
    { month: "August 2025",  bookings: 41, revenue: "$18,750", completed: 35, cancelled: 6  },
    { month: "September",    bookings: 29, revenue: "$12,300", completed: 25, cancelled: 4  },
    { month: "October 2025", bookings: 55, revenue: "$24,100", completed: 48, cancelled: 7  },
    { month: "November",     bookings: 38, revenue: "$16,500", completed: 33, cancelled: 5  },
  ];

  const clientReport = [
    { name: "John Doe",      trips: 3, totalSpent: "$3,600",  lastTrip: "Oct 25, 2025" },
    { name: "Mary Wanjiru",  trips: 5, totalSpent: "$5,200",  lastTrip: "Nov 01, 2025" },
    { name: "James Otieno",  trips: 2, totalSpent: "$2,100",  lastTrip: "Sep 15, 2025" },
    { name: "Lucy Kim",      trips: 7, totalSpent: "$8,400",  lastTrip: "Nov 10, 2025" },
  ];

  const staffReport = [
    { name: "Sarah Mwende", bookings: 22, clients: 18, revenue: "$10,500" },
    { name: "Tom Kariuki",  bookings: 19, clients: 15, revenue: "$8,900"  },
    { name: "Aisha Hassan", bookings: 31, clients: 24, revenue: "$14,200" },
  ];

  const tabs = isAdmin
    ? ["bookings", "clients", "staff"]
    : ["bookings", "clients"];

  return (
    <div className="font-[Poppins] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isAdmin ? "Full agency performance overview" : "Your performance summary"}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow transition">
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              "px-5 py-2.5 text-sm font-semibold capitalize rounded-t-lg border-b-2 transition " +
              (activeTab === tab
                ? "border-yellow-600 text-yellow-700 bg-yellow-50"
                : "border-transparent text-gray-500 hover:text-gray-700")
            }
          >
            {tab} Report
          </button>
        ))}
      </div>

      {/* Bookings Report */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">Monthly Booking Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-yellow-50 text-gray-600 text-left">
                  <th className="px-5 py-3">Month</th>
                  <th className="px-5 py-3">Bookings</th>
                  <th className="px-5 py-3">Revenue</th>
                  <th className="px-5 py-3">Completed</th>
                  <th className="px-5 py-3">Cancelled</th>
                </tr>
              </thead>
              <tbody>
                {bookingReport.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium text-gray-800">{r.month}</td>
                    <td className="px-5 py-3 text-gray-600">{r.bookings}</td>
                    <td className="px-5 py-3 font-semibold text-green-700">{r.revenue}</td>
                    <td className="px-5 py-3">
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">{r.completed}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-xs font-semibold">{r.cancelled}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clients Report */}
      {activeTab === "clients" && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">Top Clients by Spend</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-yellow-50 text-gray-600 text-left">
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Total Trips</th>
                  <th className="px-5 py-3">Total Spent</th>
                  <th className="px-5 py-3">Last Trip</th>
                </tr>
              </thead>
              <tbody>
                {clientReport.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-semibold text-gray-800">{r.name}</td>
                    <td className="px-5 py-3 text-gray-600">{r.trips}</td>
                    <td className="px-5 py-3 font-semibold text-yellow-700">{r.totalSpent}</td>
                    <td className="px-5 py-3 text-gray-500">{r.lastTrip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Report — admin only */}
      {activeTab === "staff" && isAdmin && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">Staff Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-yellow-50 text-gray-600 text-left">
                  <th className="px-5 py-3">Staff Member</th>
                  <th className="px-5 py-3">Bookings</th>
                  <th className="px-5 py-3">Clients Handled</th>
                  <th className="px-5 py-3">Revenue Generated</th>
                </tr>
              </thead>
              <tbody>
                {staffReport.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-semibold text-gray-800">{r.name}</td>
                    <td className="px-5 py-3 text-gray-600">{r.bookings}</td>
                    <td className="px-5 py-3 text-gray-600">{r.clients}</td>
                    <td className="px-5 py-3 font-semibold text-green-700">{r.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}