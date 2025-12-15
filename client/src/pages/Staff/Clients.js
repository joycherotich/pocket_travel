import React, { useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaPlaneDeparture,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Clients() {
  const [search, setSearch] = useState("");

  const clients = [
    {
      id: 1,
      name: "Joy Kirui",
      email: "joy.kirui@gmail.com",
      phone: "+254 712 345 678",
      destination: "Zanzibar",
      status: "Confirmed",
      joined: "2025-09-12",
    },
    {
      id: 2,
      name: "Luqman Rubi",
      email: "luqmanrubi@gmail.com",
      phone: "+268 789 456 123",
      destination: "Cape Town",
      status: "Pending",
      joined: "2025-10-01",
    },
    {
      id: 3,
      name: "Leah Mwangi",
      email: "leah.mwangi@gmail.com",
      phone: "+254 703 987 321",
      destination: "Mauritius",
      status: "Cancelled",
      joined: "2025-09-28",
    },
    {
      id: 4,
      name: "Samuel Dlamini",
      email: "samuel.dlamini@gmail.com",
      phone: "+268 760 555 678",
      destination: "Nairobi",
      status: "Confirmed",
      joined: "2025-10-12",
    },
  ];

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-[Poppins] p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
          <FaUserCircle className="text-yellow-500" /> Client Management
        </h2>

        <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm w-full md:w-1/3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-teal-100 text-teal-700">
                <th className="p-3">Client</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((c) => (
                  <motion.tr
                    key={c.id}
                    whileHover={{ scale: 1.01 }}
                    className="border-b hover:bg-yellow-50 transition"
                  >
                    <td className="p-3 font-semibold text-gray-800 flex items-center gap-2">
                      <FaUserCircle className="text-gray-500" /> {c.name}
                    </td>
                    <td className="p-3 text-gray-600">{c.email}</td>
                    <td className="p-3 text-gray-600">{c.phone}</td>
                    <td className="p-3 text-gray-700 font-medium">
                      <FaPlaneDeparture className="inline text-yellow-600 mr-1" />
                      {c.destination}
                    </td>
                    <td className="p-3">
                      <span
                        className={`flex items-center gap-1 font-semibold ${
                          c.status === "Confirmed"
                            ? "text-green-600"
                            : c.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {c.status === "Confirmed" && <FaCheckCircle />}
                        {c.status === "Pending" && <FaClock />}
                        {c.status === "Cancelled" && <FaTimesCircle />}
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{c.joined}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-6">
                    No clients found matching your search 🔍
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
