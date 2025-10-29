import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Client() {
  const [search, setSearch] = useState("");

  const clients = [
    { id: 1, name: "Luqman Rubi", email: "rubi@gmail.com", phone: "+254712345678", bookings: 5, spend: "$2,400", status: "Active" },
    { id: 2, name: "Mary Wanjiru", email: "mary@gmail.com", phone: "+254701234567", bookings: 3, spend: "$1,050", status: "Active" },
    { id: 3, name: "James Otieno", email: "james@otieno.com", phone: "+254710999888", bookings: 1, spend: "$420", status: "Inactive" },
    { id: 4, name: "Lucy Kim", email: "lucy@kim.com", phone: "+254799777666", bookings: 7, spend: "$3,800", status: "Active" },
    { id: 5, name: "Peter Mwangi", email: "peter@mwangi.com", phone: "+254733555444", bookings: 2, spend: "$900", status: "Inactive" },
  ];

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-[Poppins] space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-teal-700">Clients</h2>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-full shadow-md px-4 py-2 w-72">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 flex-1 outline-none text-sm text-gray-700"
          />
        </div>
      </div>

      {/* === Clients Table === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto"
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-teal-100 text-teal-700 text-left">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Bookings</th>
              <th className="p-3">Total Spend</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-semibold flex items-center gap-2 text-gray-800">
                  <FaUser className="text-teal-600" /> {c.name}
                </td>
                <td className="p-3 text-gray-600 flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" /> {c.email}
                </td>
                <td className="p-3 text-gray-600 flex items-center gap-2">
                  <FaPhone className="text-gray-400" /> {c.phone}
                </td>
                <td className="p-3">{c.bookings}</td>
                <td className="p-3 font-medium">{c.spend}</td>
                <td className="p-3 font-semibold">
                  {c.status === "Active" ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <FaCheckCircle /> Active
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <FaTimesCircle /> Inactive
                    </span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-teal-900 font-semibold px-4 py-1.5 rounded-lg text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-6">No clients found.</p>
        )}
      </motion.div>
    </div>
  );
}
