import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  const fetchUsers = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      setUsers(await res.json());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roles");
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data);
      if (data.length > 0) setFormData((p) => ({ ...p, role: data[0]._id }));
    } catch (err) { console.error(err.message); }
  };

  useEffect(() => { fetchUsers(); fetchRoles(); }, []);

  const resolveRoleName = (userRole) => {
    if (!userRole) return "Unknown";
    if (typeof userRole === "object" && userRole.name) return userRole.name;
    const byId = roles.find((r) => r._id === userRole);
    if (byId) return byId.name;
    const byName = roles.find((r) => r.name.toLowerCase() === String(userRole).toLowerCase());
    if (byName) return byName.name;
    return String(userRole);
  };

  const ROLE_COLORS = {
    admin:    "bg-red-100 text-red-700",
    staff:    "bg-blue-100 text-blue-700",
    finance:  "bg-purple-100 text-purple-700",
    customer: "bg-green-100 text-green-700",
  };

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    const loadingToast = toast.loading("Creating user…");
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, roleId: formData.role }),
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (!res.ok) {
        toast.error(data.message || "Failed to create user");
        return;
      }
      toast.success(`✅ ${data.name || formData.name} created! Credentials sent to ${formData.email} 📧`, {
        duration: 5000,
      });
      setFormData({ name: "", email: "", role: roles[0]?._id || "" });
      setModalOpen(false);
      fetchUsers();
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Server error — could not create user");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-[Poppins]">

      {/* ── Toast renderer — bottom-right corner ── */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
            borderRadius: "12px",
            padding: "14px 18px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          },
          success: {
            iconTheme: { primary: "#16a34a", secondary: "#fff" },
            style: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
          },
          error: {
            iconTheme: { primary: "#dc2626", secondary: "#fff" },
            style: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
          },
          loading: {
            style: { background: "#fefce8", color: "#854d0e", border: "1px solid #fef08a" },
          },
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-700">Manage Users</h1>
        <button onClick={() => setModalOpen(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-5 rounded shadow-md transition">
          + Create User
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-3">Existing Users</h2>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400 italic">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-sm">
          <table className="w-full border-collapse border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-yellow-100">
                <th className="border border-gray-200 px-4 py-3 text-left text-gray-700 font-semibold">#</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-gray-700 font-semibold">Name</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-gray-700 font-semibold">Email</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-gray-700 font-semibold">Role</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-gray-700 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                if (!u) return null;
                const roleName  = resolveRoleName(u.role);
                const roleColor = ROLE_COLORS[roleName.toLowerCase()] || "bg-gray-100 text-gray-700";
                return (
                  <tr key={u._id} className="hover:bg-yellow-50 transition">
                    <td className="border border-gray-200 px-4 py-3 text-gray-400 text-sm">{i + 1}</td>
                    <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">{u.name}</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-600">{u.email || "N/A"}</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleColor}`}>
                        {roleName}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      {u.mustChangePassword ? (
                        <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Temp Password</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Active</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {modalOpen && (
        <div onClick={() => setModalOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <button onClick={() => setModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
            <h2 className="text-2xl font-semibold mb-1 text-yellow-700">Create New User</h2>
            <p className="text-sm text-gray-500 mb-5">
              A temporary password will be generated and emailed to the user.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}
              <div>
                <label className="block font-semibold mb-1 text-sm">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  placeholder="e.g. Jane Mwangi"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-sm">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  placeholder="jane@example.com"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-sm">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                🔑 A secure temporary password will be auto-generated and sent to the user's email.
              </p>
              <button type="submit"
                className="w-full bg-yellow-600 text-white py-2.5 rounded hover:bg-yellow-700 transition font-semibold">
                Create User & Send Email
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}