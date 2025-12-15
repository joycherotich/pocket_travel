import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaPlaneDeparture,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function ManagePackages() {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: "", price: "", slots: "" });
  const [editing, setEditing] = useState(null);

  const token = sessionStorage.getItem("token");

  // Load all packages from backend
  const loadPackages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/packages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error loading packages:", errorData.message);
        setPackages([]);
        return;
      }

      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setPackages([]);
    }
  };

  useEffect(() => {
    if (token) loadPackages();
    else {
      console.warn("No auth token found, redirect to login");
      // optionally redirect user to login here
    }
  }, [token]);

  // Add Package
  const handleAddPackage = async () => {
    if (!newPackage.name || !newPackage.price || !newPackage.slots) return;

    try {
      const res = await fetch("http://localhost:5000/api/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newPackage,
          price: Number(newPackage.price),
          slots: Number(newPackage.slots),
          booked: 0,
          status: "Available",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error adding package:", errorData.message);
        return;
      }

      setNewPackage({ name: "", price: "", slots: "" });
      loadPackages();
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/packages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting package:", errorData.message);
        return;
      }

      loadPackages();
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Toggle status
  const handleStatusToggle = async (pkg) => {
    const updatedStatus = pkg.status === "Full" ? "Available" : "Full";

    try {
      const res = await fetch(`http://localhost:5000/api/packages/${pkg._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error updating package:", errorData.message);
        return;
      }

      loadPackages();
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Save Edit
  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/packages/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editing),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error saving package edit:", errorData.message);
        return;
      }

      setEditing(null);
      loadPackages();
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="font-[Poppins] space-y-10">
      <h2 className="text-3xl font-bold text-teal-700">Manage Packages</h2>

      {/* Add Form */}
      <motion.div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaPlus className="text-yellow-500" /> Add New Package
        </h3>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Package Name"
            value={newPackage.name}
            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
            className="border rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Price ($)"
            value={newPackage.price}
            onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
            className="border rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Total Slots"
            value={newPackage.slots}
            onChange={(e) => setNewPackage({ ...newPackage, slots: e.target.value })}
            className="border rounded-lg p-2"
          />
          <button
            onClick={handleAddPackage}
            className="bg-yellow-400 hover:bg-yellow-500 text-teal-900 font-semibold px-4 py-2 rounded-lg"
          >
            Add Package
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div className="bg-white shadow-md rounded-2xl p-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-teal-100 text-teal-700 text-left">
              <th className="p-3">Destination</th>
              <th className="p-3">Price</th>
              <th className="p-3">Slots</th>
              <th className="p-3">Booked</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <tr key={pkg._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-semibold flex items-center gap-2">
                    <FaPlaneDeparture className="text-teal-600" /> {pkg.name}
                  </td>
                  <td className="p-3">${pkg.price}</td>
                  <td className="p-3">{pkg.slots}</td>
                  <td className="p-3">{pkg.booked}</td>
                  <td className="p-3 font-semibold">
                    {pkg.status === "Full" ? (
                      <span className="text-red-600 flex items-center gap-1">
                        <FaTimesCircle /> Full
                      </span>
                    ) : (
                      <span className="text-green-600 flex items-center gap-1">
                        <FaCheckCircle /> Available
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleStatusToggle(pkg)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => setEditing(pkg)}
                      className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-6">
                  No packages available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <motion.div className="bg-white p-6 rounded-2xl w-96 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-teal-700">
              Edit Package
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
              <input
                type="number"
                value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
              <input
                type="number"
                value={editing.slots}
                onChange={(e) => setEditing({ ...editing, slots: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
              <input
                type="number"
                value={editing.booked}
                onChange={(e) => setEditing({ ...editing, booked: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
