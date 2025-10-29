import React, { useState } from "react";
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
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Zanzibar Getaway",
      price: 1200,
      slots: 20,
      booked: 18,
      status: "Available",
    },
    {
      id: 2,
      name: "Cape Town Adventure",
      price: 950,
      slots: 15,
      booked: 15,
      status: "Full",
    },
    {
      id: 3,
      name: "Mauritius Paradise",
      price: 1350,
      slots: 25,
      booked: 10,
      status: "Available",
    },
  ]);

  const [newPackage, setNewPackage] = useState({
    name: "",
    price: "",
    slots: "",
  });

  const [editing, setEditing] = useState(null);

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.price || !newPackage.slots) return;

    const pkg = {
      id: Date.now(),
      name: newPackage.name,
      price: parseFloat(newPackage.price),
      slots: parseInt(newPackage.slots),
      booked: 0,
      status: "Available",
    };

    setPackages([...packages, pkg]);
    setNewPackage({ name: "", price: "", slots: "" });
  };

  const handleDelete = (id) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  const handleEdit = (pkg) => {
    setEditing(pkg);
  };

  const handleSaveEdit = () => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === editing.id
          ? { ...editing, status: editing.booked >= editing.slots ? "Full" : "Available" }
          : pkg
      )
    );
    setEditing(null);
  };

  const handleStatusToggle = (id) => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === id
          ? { ...pkg, status: pkg.status === "Full" ? "Available" : "Full" }
          : pkg
      )
    );
  };

  return (
    <div className="font-[Poppins] space-y-10">
      <h2 className="text-3xl font-bold text-teal-700">Manage Packages</h2>

      {/* === Add New Package Form === */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaPlus className="text-yellow-500" /> Add New Package
        </h3>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Package Name"
            value={newPackage.name}
            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
            className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="number"
            placeholder="Price ($)"
            value={newPackage.price}
            onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
            className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="number"
            placeholder="Total Slots"
            value={newPackage.slots}
            onChange={(e) => setNewPackage({ ...newPackage, slots: e.target.value })}
            className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            onClick={handleAddPackage}
            className="bg-yellow-400 hover:bg-yellow-500 text-teal-900 font-semibold px-4 py-2 rounded-lg transition"
          >
            Add Package
          </button>
        </div>
      </motion.div>

      {/* === Packages Table === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-md rounded-2xl p-6 overflow-x-auto"
      >
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
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-semibold text-gray-800 flex items-center gap-2">
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
                    onClick={() => handleStatusToggle(pkg.id)}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {packages.length === 0 && (
          <p className="text-center text-gray-500 py-6">No packages available.</p>
        )}
      </motion.div>

      {/* === Edit Modal === */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-xl w-96"
          >
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
