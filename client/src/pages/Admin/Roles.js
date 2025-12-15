import React, { useState, useEffect } from "react";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newRole, setNewRole] = useState("");

  // Fetch roles from backend
  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/roles");
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data);
      setFilteredRoles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter roles on searchTerm change
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRoles(roles);
    } else {
      setFilteredRoles(
        roles.filter((r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, roles]);

  // Handle new role modal input change
  const handleNewRoleChange = (e) => setNewRole(e.target.value);

  // Handle form submit to create new role
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRole.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create role");
      }

      setNewRole("");
      setModalOpen(false);
      fetchRoles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-[Poppins]">
      <h1 className="text-4xl font-bold mb-6 text-yellow-700">Roles & Privileges</h1>

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded transition w-full md:w-auto"
        >
          Create Role
        </button>

        <div className="flex items-center gap-4">
          <label htmlFor="entries" className="font-semibold text-gray-700">
            Show
          </label>
          <select
            id="entries"
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
            disabled
            defaultValue="10"
          >
            <option>10</option>
          </select>
          <label className="font-semibold text-gray-700">entries</label>
        </div>

        <div>
          <input
            type="search"
            placeholder="Search role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Loading */}
      {loading && <p>Loading roles...</p>}

      {/* Roles Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-yellow-100">
            <tr>
              <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">
                Role Desc
              </th>
              <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700">
                Edit
              </th>
              <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700">
                Privileges
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No roles found.
                </td>
              </tr>
            ) : (
              filteredRoles.map((role) => (
                <tr
                  key={role._id}
                  className="hover:bg-yellow-50 cursor-pointer transition"
                >
                  <td className="border border-gray-300 px-6 py-4 text-gray-800 font-semibold">
                    {role.name}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-center">
                    <button
                      className="text-yellow-600 hover:text-yellow-800 font-semibold"
                      onClick={() => alert(`Edit role: ${role.name}`)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-center">
                    <button
                      className="text-yellow-600 hover:text-yellow-800 font-semibold"
                      onClick={() => alert(`Manage privileges for: ${role.name}`)}
                    >
                      Privileges
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4 text-yellow-700">
              Create New Role
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="roleName"
                  className="block font-semibold mb-1"
                >
                  Role Name
                </label>
                <input
                  id="roleName"
                  type="text"
                  value={newRole}
                  onChange={handleNewRoleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter role name"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition"
                >
                  Create Role
                </button>
              </div>
            </form>
            {error && (
              <p className="text-red-600 mt-3 font-semibold">{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
