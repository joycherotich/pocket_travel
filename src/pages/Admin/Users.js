import React, { useState } from "react";
import { FaTrash, FaPlus, FaUserShield } from "react-icons/fa";

const availableRoles = {
  Admin: ["All Permissions"],
  Manager: ["Manage Users", "View Reports", "Edit Packages"],
  Staff: ["View Clients", "Process Payments"],
  Support: ["Assist Clients", "Resolve Tickets"],
};

export default function Users() {
// Add `clients` field to each user
const [users, setUsers] = useState([
    {
      id: 1,
      name: "Luqman Rubi",
      email: "rubi@gmail.com",
      status: "Active",
      roles: ["Admin"],
      commissionEarned: 0,
      commissionStatus: "N/A",
      clients: 0,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@gmail.com",
      status: "Active",
      roles: ["Manager"],
      commissionEarned: 0,
      commissionStatus: "N/A",
      clients: 2,
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@gmail.com",
      status: "Inactive",
      roles: ["Staff"],
      commissionEarned: 120,
      commissionStatus: "Pending",
      clients: 6,
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah@gmail.com",
      status: "Active",
      roles: ["Support", "Staff"],
      commissionEarned: 75,
      commissionStatus: "Paid",
      clients: 3,
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@gmail.com",
      status: "Inactive",
      roles: [],
      commissionEarned: 0,
      commissionStatus: "N/A",
      clients: 0,
    },
  ]);
  

  const [newRoles, setNewRoles] = useState({});
  const [search, setSearch] = useState("");

  const handleAddRole = (userId) => {
    const roleToAdd = newRoles[userId];
    if (!roleToAdd) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId && !user.roles.includes(roleToAdd)
          ? { ...user, roles: [...user.roles, roleToAdd] }
          : user
      )
    );
    setNewRoles((prev) => ({ ...prev, [userId]: "" }));
  };

  const handleRemoveRole = (userId, role) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, roles: user.roles.filter((r) => r !== role) }
          : user
      )
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Users, Roles & Commissions</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-3 py-2 mb-4 w-1/3"
      />

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
  Clients
</th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Commission Earned
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Commission Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user, idx) => (
              <tr
                key={user.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {role}
                      {role !== "Admin" && (
                        <FaTrash
                          className="cursor-pointer text-red-500"
                          onClick={() => handleRemoveRole(user.id, role)}
                        />
                      )}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.roles.length > 0
                    ? user.roles
                        .map((role) => availableRoles[role]?.join(", "))
                        .join("; ")
                    : "-"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
  {user.clients}
</td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${user.commissionEarned}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.commissionStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : user.commissionStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.commissionStatus}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {user.roles.includes("Admin") ? (
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <FaUserShield /> All Permissions
                    </span>
                  ) : (
                    <>
                      <select
                        value={newRoles[user.id] || ""}
                        onChange={(e) =>
                          setNewRoles((prev) => ({
                            ...prev,
                            [user.id]: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="">Select role</option>
                        {Object.keys(availableRoles).map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAddRole(user.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition flex items-center gap-1"
                      >
                        <FaPlus /> Add
                      </button>
                    </>
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
