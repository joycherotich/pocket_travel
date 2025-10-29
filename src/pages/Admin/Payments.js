import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaUndo,
} from "react-icons/fa";

export default function Payments() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      client: "John Doe",
      package: "Zanzibar Getaway",
      amount: 1200,
      date: "2025-10-21",
      status: "Paid",
      method: "Card",
    },
    {
      id: 2,
      client: "Mary Wambui",
      package: "Cape Town Adventure",
      amount: 950,
      date: "2025-10-22",
      status: "Pending",
      method: "PayPal",
    },
    {
      id: 3,
      client: "Paul Otieno",
      package: "Mauritius Paradise",
      amount: 1350,
      date: "2025-10-25",
      status: "Paid",
      method: "M-Pesa",
    },
    {
      id: 4,
      client: "Alice Kimani",
      package: "Cape Town Adventure",
      amount: 950,
      date: "2025-10-28",
      status: "Refunded",
      method: "Card",
    },
  ]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredPayments = useMemo(() => {
    return payments.filter(
      (p) =>
        (filter === "All" || p.status === filter) &&
        (p.client.toLowerCase().includes(search.toLowerCase()) ||
          p.package.toLowerCase().includes(search.toLowerCase()))
    );
  }, [payments, filter, search]);

  const totalAmount = filteredPayments.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  const handleMarkPaid = (id) => {
    setPayments(
      payments.map((p) =>
        p.id === id ? { ...p, status: "Paid" } : p
      )
    );
  };

  const handleRefund = (id) => {
    setPayments(
      payments.map((p) =>
        p.id === id ? { ...p, status: "Refunded" } : p
      )
    );
  };

  return (
    <div className="font-[Poppins] space-y-10">
      <h2 className="text-3xl font-bold text-teal-700 flex items-center gap-2">
        <FaMoneyBillWave className="text-yellow-400" /> Payments Management
      </h2>

      {/* === Filters & Search === */}
      <div className="flex flex-wrap gap-4 justify-between bg-white p-4 rounded-2xl shadow-sm border">
        <div className="flex gap-2">
          {["All", "Paid", "Pending", "Refunded"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === type
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-gray-50">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search client or package..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none bg-transparent"
          />
        </div>
      </div>

      {/* === Payments Summary === */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-teal-50 rounded-xl p-5 flex justify-between items-center shadow-sm"
      >
        <p className="text-gray-700 font-medium">
          Showing <span className="font-semibold">{filteredPayments.length}</span>{" "}
          payments — Total:{" "}
          <span className="font-semibold text-teal-700">${totalAmount}</span>
        </p>
      </motion.div>

      {/* === Payments Table === */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-md rounded-2xl overflow-x-auto p-6"
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-teal-100 text-teal-700 text-left">
              <th className="p-3">Client</th>
              <th className="p-3">Package</th>
              <th className="p-3">Method</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 transition-all"
              >
                <td className="p-3 font-semibold text-gray-800">{p.client}</td>
                <td className="p-3">{p.package}</td>
                <td className="p-3 text-gray-600">{p.method}</td>
                <td className="p-3 font-medium">${p.amount}</td>
                <td className="p-3 text-gray-500">{p.date}</td>
                <td className="p-3 font-semibold">
                  {p.status === "Paid" && (
                    <span className="text-green-600 flex items-center gap-1">
                      <FaCheckCircle /> Paid
                    </span>
                  )}
                  {p.status === "Pending" && (
                    <span className="text-yellow-600 flex items-center gap-1">
                      <FaMoneyBillWave /> Pending
                    </span>
                  )}
                  {p.status === "Refunded" && (
                    <span className="text-red-600 flex items-center gap-1">
                      <FaUndo /> Refunded
                    </span>
                  )}
                </td>
                <td className="p-3 text-right space-x-2">
                  {p.status === "Pending" && (
                    <button
                      onClick={() => handleMarkPaid(p.id)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200"
                    >
                      Mark Paid
                    </button>
                  )}
                  {p.status === "Paid" && (
                    <button
                      onClick={() => handleRefund(p.id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200"
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No payments found for this filter.
          </p>
        )}
      </motion.div>
    </div>
  );
}
