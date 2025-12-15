import React, { useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFilter,
  FaSearch,
  FaPlaneDeparture,
  FaUsers,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Bookings() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const bookings = [
    {
      id: 1,
      destination: "Zanzibar",
      client: "John Doe",
      clients: 4,
      status: "Confirmed",
      availability: "Few Spots Left",
      date: "2025-11-10",
    },
    {
      id: 2,
      destination: "Cape Town",
      client: "Jane Smith",
      clients: 2,
      status: "Pending",
      availability: "Available",
      date: "2025-12-05",
    },
    {
      id: 3,
      destination: "Mauritius",
      client: "David Kim",
      clients: 5,
      status: "Full",
      availability: "Full",
      date: "2025-11-22",
    },
    {
      id: 4,
      destination: "Nairobi",
      client: "Grace Moyo",
      clients: 3,
      status: "Confirmed",
      availability: "Available",
      date: "2025-12-15",
    },
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filter === "All" || b.status === filter;
    const matchesSearch =
      b.destination.toLowerCase().includes(search.toLowerCase()) ||
      b.client.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="font-[Poppins] bg-gray-50 min-h-screen p-6 md:p-10">
      <h2 className="text-3xl font-bold text-teal-700 mb-6 flex items-center gap-3">
        <FaPlaneDeparture /> Manage Bookings
      </h2>

      {/* ===== Filter and Search Bar ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by destination or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Full">Full</option>
          </select>
        </div>
      </div>

      {/* ===== Bookings Table ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-md overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-teal-100 text-teal-700">
              <th className="p-4">Destination</th>
              <th className="p-4">Client</th>
              <th className="p-4">Travellers</th>
              <th className="p-4">Status</th>
              <th className="p-4">Availability</th>
              <th className="p-4">Departure</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b hover:bg-yellow-50 transition"
                >
                  <td className="p-4 font-semibold text-gray-800 flex items-center gap-2">
                    <FaPlaneDeparture className="text-yellow-600" />{" "}
                    {b.destination}
                  </td>
                  <td className="p-4">{b.client}</td>
                  <td className="p-4 flex items-center gap-1">
                    <FaUsers /> {b.clients}
                  </td>
                  <td className="p-4">
                    <span
                      className={`flex items-center gap-1 font-semibold ${
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
                  <td
                    className={`p-4 ${
                      b.availability === "Full"
                        ? "text-red-600 font-semibold"
                        : "text-teal-700"
                    }`}
                  >
                    {b.availability}
                  </td>
                  <td className="p-4 text-gray-600">{b.date}</td>
                  <td className="p-4 text-center">
                    <button
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg text-sm transition"
                      onClick={() => alert(`Viewing booking for ${b.client}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No bookings match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* ===== Stats Summary ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {[
          { title: "Total Bookings", value: bookings.length, color: "bg-yellow-100 text-yellow-700" },
          { title: "Confirmed", value: bookings.filter((b) => b.status === "Confirmed").length, color: "bg-green-100 text-green-700" },
          { title: "Pending", value: bookings.filter((b) => b.status === "Pending").length, color: "bg-blue-100 text-blue-700" },
          { title: "Full", value: bookings.filter((b) => b.status === "Full").length, color: "bg-red-100 text-red-700" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`p-5 rounded-xl shadow-md flex flex-col items-center ${stat.color}`}
          >
            <h4 className="text-sm font-semibold">{stat.title}</h4>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
