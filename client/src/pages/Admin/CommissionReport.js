import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function CommissionReport() {
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    // Dummy data for demonstration
    const dummyData = [
      { id: 1, staffName: "Luqman Rubi", totalSales: 1500, commission: 150, status: "Pending" },
      { id: 2, staffName: "Jane Smith", totalSales: 1200, commission: 120, status: "Paid" },
      { id: 3, staffName: "Michael Brown", totalSales: 800, commission: 80, status: "Pending" },
      { id: 4, staffName: "Sarah Johnson", totalSales: 500, commission: 50, status: "Paid" },
      { id: 5, staffName: "David Wilson", totalSales: 0, commission: 0, status: "Pending" },
    ];
    setCommissions(dummyData);
  }, []);

  const markPaid = (id) => {
    setCommissions((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Paid" } : c
      )
    );
    // Here you can call your API to update the backend
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Staff Commissions</h2>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Staff</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Sales</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Commission</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {commissions.map((c, idx) => (
              <tr key={c.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 font-medium text-gray-900">{c.staffName}</td>
                <td className="px-6 py-4">KES{c.totalSales}</td>
                <td className="px-6 py-4">KES{c.commission}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    c.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {c.status === "Pending" && (
                    <button
                      onClick={() => markPaid(c.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition flex items-center gap-1"
                    >
                      <FaCheckCircle /> Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
